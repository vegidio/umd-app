package shared

import (
	"crypto/sha256"
	"fmt"
	"github.com/spf13/afero"
	"github.com/vegidio/umd-lib"
	"github.com/vegidio/umd-lib/fetch"
	"path/filepath"
	"sync"
	"time"
)

var fs = afero.NewOsFs()

func DownloadAll(
	media []umd.Media,
	directory string,
	parallel int,
	onMediaDownload func(download Download),
) []Download {
	var wg sync.WaitGroup
	sem := make(chan struct{}, parallel)

	fetchObj := fetch.New(nil, 10)
	downloads := make([]Download, 0)

	for i, m := range media {
		wg.Add(1)

		go func(index int, media umd.Media) {
			defer func() {
				<-sem
				wg.Done()
			}()

			sem <- struct{}{} // acquire a semaphore token

			filePath := CreateFilePath(directory, media, index)
			newDownload := DownloadMedia(media, filePath, fetchObj)
			downloads = append(downloads, newDownload)

			// Send status update to the UI
			if onMediaDownload != nil {
				onMediaDownload(newDownload)
			}
		}(i, m)
	}

	wg.Wait()
	close(sem)

	return downloads
}

func CreateFilePath(directory string, media umd.Media, index int) string {
	var t time.Time
	var err error

	n := media.Metadata["name"].(string)

	// If array of Media is coming from the JS code, the values in the Metadata map are strings
	timeStr, ok := media.Metadata["created"].(string)
	if ok {
		t, err = time.Parse(time.RFC3339, timeStr)
		if err != nil {
			t = time.Now()
		}
	} else {
		t = media.Metadata["created"].(time.Time)
	}

	// Go uses a specific layout to represent the time format
	// It is based on the time: Mon Jan 2 15:04:05 MST 2006
	formattedTime := t.Format("20060102-150405")

	ext := media.Extension
	if ext == "" {
		ext = "unknown"
	}

	fileName := fmt.Sprintf("%s-%s-%d.%s", formattedTime, n, index+1, ext)
	return filepath.Join(directory, fileName)
}

func DownloadMedia(media umd.Media, filePath string, fetchObj fetch.Fetch) Download {
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
