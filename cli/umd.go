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
) error {
	msg := ""
	queryCount := 0
	name := ""
	mp := shared.NewMixPanel(uuid.New().String())
	fields := make(map[string]any)
	var stopSpinner context.CancelFunc

	fields["interface"] = "cli"
	fields["limit"] = limit

	u, err := umd.New(url, nil, func(ev event.Event) {
		switch e := ev.(type) {
		case event.OnExtractorFound:
			fields["extractor"] = e.Name
			pterm.Print("\n🌎 Website found: ", pterm.FgLightGreen.Sprintf(e.Name))

		case event.OnExtractorTypeFound:
			pterm.Println("; extractor type:", pterm.FgLightYellow.Sprintf("%s", e.Type))
			fields["source"] = e.Type
			fields["name"] = e.Name
			mp.Track("Start Download", fields)

			name = e.Name
			msg = pterm.Sprintf("📝 Querying %s %s for media files...", strings.ToLower(e.Type),
				pterm.Bold.Sprintf(e.Name))
			stopSpinner = spinner.CreateSpinner(msg, queryCount)

		case event.OnMediaQueried:
			queryCount += e.Amount
			spinner.UpdateSpinner(msg, int(math.Min(float64(queryCount), float64(limit))))

		case event.OnQueryCompleted:
			stopSpinner()
			time.Sleep(250 * time.Millisecond) // Wait for the spinner to finish
		}
	})

	if err != nil {
		return err
	}

	resp, err := u.QueryMedia(limit, extensions, true)
	if err != nil {
		return err
	}

	clear(fields)
	fields["parallel"] = parallel
	fields["mediaFound"] = len(resp.Media)

	fullDir := filepath.Join(directory, name)
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
