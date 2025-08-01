package main

import (
	"github.com/google/uuid"
	"github.com/samber/lo"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/afero"
	"github.com/vegidio/shared"
	"github.com/vegidio/umd-lib"
	"github.com/vegidio/umd-lib/fetch"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os/user"
	"path/filepath"
	"time"
)

var name string
var extractorName string
var mp *shared.MixPanel
var stop func()

func (a *App) QueryMedia(url string, directory string, limit int, deep bool, noCache bool, enableTelemetry bool) ([]umd.Media, error) {
	var resp *umd.Response

	mp = shared.NewMixPanel(uuid.New().String())
	fields := make(map[string]any)
	fields["interface"] = "gui"
	fields["limit"] = limit

	extractor, err := umd.New(nil).FindExtractor(url)
	if err != nil {
		return nil, err
	}

	extractorName = extractor.Type().String()
	a.OnExtractorFound(extractorName)
	fields["extractor"] = extractorName

	source, err := extractor.SourceType()
	if err != nil {
		return nil, err
	}

	name = source.Name()
	fields["source"] = source.Type()
	fields["name"] = name
	fullDir := filepath.Join(directory, extractorName, name)
	cachePath := filepath.Join(fullDir, "_cache.gob")

	a.OnExtractorTypeFound(source.Type(), name)

	// Load any existing cache
	if !noCache {
		resp, _ = shared.LoadCache(cachePath)
		if resp != nil && len(resp.Media) == 0 {
			resp = nil
		}
	}

	fields["cache"] = resp != nil

	if enableTelemetry {
		mp.Track("Start Download", fields)
	}

	// nil means that nothing was found in the cache
	if resp == nil {
		resp, stop = extractor.QueryMedia(limit, make([]string, 0), deep)

		err = resp.Track(func(_, total int) {
			a.OnMediaQueried(total)
		})

		if err != nil {
			return nil, err
		}

		_ = shared.SaveCache(cachePath, resp)
	}

	a.OnQueryCompleted(len(resp.Media), fields["cache"].(bool))

	return resp.Media, nil
}

func (a *App) StopQuery() {
	if stop != nil {
		stop()
		stop = nil
	}
}

func (a *App) CancelDownloads() {
	shared.CancelDownloads()
}

func (a *App) StartDownload(media []umd.Media, directory string, parallel int, enableTelemetry bool) []shared.Download {
	fields := make(map[string]any)
	fields["parallel"] = parallel
	fields["mediaFound"] = len(media)

	fullDir := filepath.Join(directory, extractorName, name)
	queue := shared.NewQueue(5)
	responses := make([]*fetch.Response, 0)

	startMonitor := make(chan struct{})

	go func() {
		<-startMonitor

		for {
			items := queue.Items()
			if queue.Incompleted() == 0 {
				items = lo.Map(items, func(r *fetch.Response, _ int) *fetch.Response {
					r.Progress = 1
					return r
				})

				a.OnMediaDownloaded(len(responses), items)
				break
			}

			a.OnMediaDownloaded(len(responses), items)
			time.Sleep(100 * time.Millisecond)
		}
	}()

	opened := false
	for response := range shared.DownloadAll(media, fullDir, parallel, make([]fetch.Cookie, 0)) {
		queue.Add(response)

		if !opened {
			close(startMonitor)
			opened = true
		}

		go func(r *fetch.Response) {
			response.Track(func(_, _ int64, progress float64) {
				if progress >= 1 {
					responses = append(responses, response)
				}
			})
		}(response)
	}

	for len(responses) < len(media) {
		// waiting for all responses to complete
	}

	downloads := lo.Map(responses, func(r *fetch.Response, _ int) shared.Download { return shared.ResponseToDownload(r) })
	successes := lo.CountBy(downloads, func(d shared.Download) bool { return d.IsSuccess })
	failures := lo.CountBy(downloads, func(d shared.Download) bool { return !d.IsSuccess })
	fields["numSuccesses"] = successes
	fields["numFailures"] = failures

	_, remaining := shared.RemoveDuplicates(downloads, nil)
	shared.CreateReport(fullDir, remaining)

	if enableTelemetry {
		mp.Track("End Download", fields)
	}

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
