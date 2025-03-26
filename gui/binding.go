package main

import (
	"fmt"
	"github.com/google/uuid"
	"github.com/samber/lo"
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
var mp *shared.MixPanel

func (a *App) QueryMedia(url string, limit int, deep bool) ([]umd.Media, error) {
	var err error

	mp = shared.NewMixPanel(uuid.New().String())
	fields := make(map[string]any)
	fields["interface"] = "gui"
	fields["limit"] = limit

	umdObj, err = umd.New(url, nil, func(ev event.Event) {
		switch e := ev.(type) {
		case event.OnExtractorFound:
			fields["extractor"] = e.Name
			a.OnExtractorFound(e.Name)
		case event.OnExtractorTypeFound:
			fields["source"] = e.Type
			fields["name"] = e.Name
			mp.Track("Start Download", fields)

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

	fmt.Println(resp.Media)

	return resp.Media, nil
}

func (a *App) StartDownload(media []umd.Media, directory string, parallel int) []shared.Download {
	fields := make(map[string]any)
	fields["parallel"] = parallel
	fields["mediaFound"] = len(media)

	fullDir := filepath.Join(directory, name)
	downloads := shared.DownloadAll(media, fullDir, parallel, func(download shared.Download) {
		a.OnMediaDownloaded(download)
	})

	successes := lo.CountBy(downloads, func(d shared.Download) bool { return d.IsSuccess })
	failures := lo.CountBy(downloads, func(d shared.Download) bool { return !d.IsSuccess })
	fields["numSuccesses"] = successes
	fields["numFailures"] = failures

	_, remaining := shared.RemoveDuplicates(downloads, nil)
	shared.CreateReport(fullDir, remaining)

	mp.Track("End Download", fields)
	return downloads
}

func (a *App) IsOutdated() bool {
	return shared.IsOutdated(shared.Version, "vegidio/umd-app")
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
