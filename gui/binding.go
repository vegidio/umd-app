package main

import (
	log "github.com/sirupsen/logrus"
	"github.com/spf13/afero"
	"github.com/vegidio/shared"
	"github.com/vegidio/umd-lib"
	"github.com/vegidio/umd-lib/event"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os/user"
	"path/filepath"
)

var umdObj *umd.Umd
var name string

func (a *App) QueryMedia(url string, limit int, deep bool) ([]umd.Media, error) {
	var err error

	umdObj, err = umd.New(url, nil, func(ev event.Event) {
		switch e := ev.(type) {
		case event.OnExtractorFound:
			a.OnExtractorFound(e.Name)
		case event.OnExtractorTypeFound:
			name = e.Name
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

func (a *App) StartDownload(media []umd.Media, directory string, parallel int) []shared.Download {
	fullDir := filepath.Join(directory, name)
	downloads := shared.DownloadAll(media, fullDir, parallel, func(download shared.Download) {
		a.OnMediaDownloaded(download)
	})

	_, remaining := shared.RemoveDuplicates(downloads, nil)
	shared.CreateReport(fullDir, remaining)

	return downloads
}

func (a *App) GetHomeDirectory() string {
	currentUser, err := user.Current()
	if err != nil {
		log.Error("Error getting current user:", err)
		return "."
	}

	initialDir := filepath.Join(currentUser.HomeDir, "UMD")
	return initialDir
}

func (a *App) OpenDirectory(currentDir string) string {
	exists, _ := afero.DirExists(afero.NewOsFs(), currentDir)
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
