package main

import (
	"crypto/sha256"
	"fmt"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/afero"
	"github.com/vegidio/umd-lib"
	"github.com/vegidio/umd-lib/event"
	"github.com/vegidio/umd-lib/fetch"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os/user"
	"path/filepath"
	"sync"
	"time"
)

var umdObj *umd.Umd
var fs = afero.NewOsFs()

func (a *App) QueryMedia(url string, limit int, deep bool) ([]umd.Media, error) {
	var err error

	umdObj, err = umd.New(url, nil, func(ev event.Event) {
		switch e := ev.(type) {
		case event.OnExtractorFound:
			a.OnExtractorFound(e.Name)
		case event.OnExtractorTypeFound:
			a.OnExtractorTypeFound(e.Type, e.Name)
		case event.OnMediaQueried:
			a.OnMediaQueried(e.Amount)
		case event.OnQueryCompleted:
			a.OnQueryCompleted(e.Total)
		}
	})

	if err != nil {
		return make([]umd.Media, 0), err
	}

	resp, err := umdObj.QueryMedia(limit, make([]string, 0), deep)
	if err != nil {
		return make([]umd.Media, 0), err
	}

	return resp.Media, nil
}

func (a *App) StartDownload(media []umd.Media, directory string, parallel int) []Download {
	var wg sync.WaitGroup
	sem := make(chan struct{}, parallel)

	fetchObj := umdObj.GetFetch()
	downloads := make([]Download, 0)

	for i, m := range media {
		wg.Add(1)

		go func(index int, media umd.Media) {
			defer func() {
				<-sem
				wg.Done()
			}()

			sem <- struct{}{} // acquire a semaphore token

			filePath := createFilePath(directory, media, index)
			newDownload := downloadMedia(media, filePath, fetchObj)
			downloads = append(downloads, newDownload)

			// Send status update to the UI
			a.OnMediaDownloaded(newDownload)
		}(i, m)
	}

	wg.Wait()
	close(sem)

	return downloads
}

func (a *App) GetHomeDirectory() string {
	currentUser, err := user.Current()
	if err != nil {
		log.Error("Error getting current user:", err)
		return "."
	}

	return currentUser.HomeDir
}

func (a *App) OpenDirectory(currentDir string) string {
	exists, _ := afero.DirExists(fs, currentDir)
	if !exists {
		currentDir = "."
	}

	directory, _ := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		DefaultDirectory:     currentDir,
		Title:                "Select a directory to save the media",
		CanCreateDirectories: true,
	})

	if directory == "" {
		return currentDir
	}

	return directory
}

// region - Private functions

func createFilePath(directory string, media umd.Media, index int) string {
	n := media.Metadata["name"].(string)

	// This array of Media is coming from the JS code, so the values in the Metadata map are strings
	timeStr := media.Metadata["created"].(string)
	t, err := time.Parse(time.RFC3339, timeStr)
	if err != nil {
		t = time.Now()
	}

	// Go uses a specific layout to represent the time format
	// It is based on the time: Mon Jan 2 15:04:05 MST 2006
	formattedTime := t.Format("20060102-150405")

	fileName := fmt.Sprintf("%s-%s-%d.%s", formattedTime, n, index+1, media.Extension)
	return filepath.Join(directory, fileName)
}

func downloadMedia(media umd.Media, filePath string, fetchObj fetch.Fetch) Download {
	_, err := fetchObj.DownloadFile(media.Url, filePath)
	file, _ := afero.ReadFile(fs, filePath)
	hash := sha256.Sum256(file)

	return Download{
		Url:       media.Url,
		FilePath:  filePath,
		Error:     err,
		IsSuccess: err == nil,
		Hash:      fmt.Sprintf("%x", hash),
	}
}

// endregion
