package main

import (
	"cli/internal/spinner"
	"context"
	"github.com/google/uuid"
	"github.com/pterm/pterm"
	"github.com/samber/lo"
	"github.com/vegidio/shared"
	"github.com/vegidio/umd-lib"
	"github.com/vegidio/umd-lib/event"
	"math"
	"path/filepath"
	"strings"
	"time"
)

func startQuery(
	url string,
	directory string,
	parallel int,
	limit int,
	extensions []string,
	noCache bool,
) error {
	msg := ""
	queryCount := 0
	mp := shared.NewMixPanel(uuid.New().String())
	fields := make(map[string]any)
	var stopSpinner context.CancelFunc
	var resp *umd.Response
	var err error

	fields["interface"] = "cli"
	fields["limit"] = limit

	u := umd.New(nil, func(ev event.Event) {
		switch e := ev.(type) {
		case event.OnExtractorFound:
			fields["extractor"] = e.Name
			pterm.Print("\n🌎 Website found: ", pterm.FgLightGreen.Sprintf(e.Name))

		case event.OnExtractorTypeFound:
			pterm.Println("; extractor type:", pterm.FgLightYellow.Sprintf("%s", e.Type))
			fields["source"] = e.Type
			fields["name"] = e.Name

		case event.OnMediaQueried:
			queryCount += e.Amount
			spinner.UpdateSpinner(msg, int(math.Min(float64(queryCount), float64(limit))))
		}
	})

	extractor, err := u.FindExtractor(url)
	if err != nil {
		return err
	}

	source, err := extractor.GetSourceType()
	if err != nil {
		return err
	}

	fullDir := filepath.Join(directory, source.GetName())
	cachePath := filepath.Join(fullDir, "_cache.gob")

	// Load any existing cache
	if !noCache {
		resp, _ = shared.LoadCache(cachePath)

		if resp != nil {
			msg = pterm.Sprintf("💾 Using cached results for %s %s...",
				strings.ToLower(fields["source"].(string)), pterm.Bold.Sprintf(fields["name"].(string)))
			stopSpinner = spinner.CreateSpinner(msg, len(resp.Media))
		}
	}

	fields["cache"] = resp != nil
	mp.Track("Start Download", fields)

	// nil means that nothing was found in the cache
	if resp == nil {
		msg = pterm.Sprintf("📝 Querying %s %s for media files...", strings.ToLower(fields["source"].(string)),
			pterm.Bold.Sprintf(fields["name"].(string)))
		stopSpinner = spinner.CreateSpinner(msg, queryCount)

		resp, err = extractor.QueryMedia(limit, extensions, true)
		if err != nil {
			return err
		}

		_ = shared.SaveCache(cachePath, resp)
	}

	// Wait for the spinner to finish
	stopSpinner()
	time.Sleep(250 * time.Millisecond)

	clear(fields)
	fields["parallel"] = parallel
	fields["mediaFound"] = len(resp.Media)

	downloads := startDownload(resp.Media, fullDir, parallel)

	successes := lo.CountBy(downloads, func(d shared.Download) bool { return d.IsSuccess })
	failures := lo.CountBy(downloads, func(d shared.Download) bool { return !d.IsSuccess })
	fields["numSuccesses"] = successes
	fields["numFailures"] = failures

	isFirstDuplicate := true
	_, remaining := shared.RemoveDuplicates(downloads, func(download shared.Download) {
		if isFirstDuplicate {
			pterm.Println("\n🚮 Removing duplicated downloads...")
			isFirstDuplicate = false
		}

		fileName := filepath.Base(download.FilePath)
		pterm.Printf("["+pterm.LightRed("D")+"] Deleting file %s\n", pterm.Bold.Sprintf(fileName))
	})

	mp.Track("End Download", fields)
	shared.CreateReport(fullDir, remaining)

	pterm.Println("\n🌟 Done!")
	return nil
}

func startDownload(media []umd.Media, directory string, parallel int) []shared.Download {
	pb, _ := pterm.DefaultProgressbar.
		WithTotal(len(media)).
		Start("Downloading")

	return shared.DownloadAll(media, directory, parallel, func(download shared.Download) {
		pb.Increment()
	})
}
