package main

import (
	"cli/internal/spinner"
	"context"
	"github.com/pterm/pterm"
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
	var stopSpinner context.CancelFunc

	u, err := umd.New(url, nil, func(ev event.Event) {
		switch e := ev.(type) {
		case event.OnExtractorFound:
			pterm.Print("\n🌎 Website found: ", pterm.FgLightGreen.Sprintf(e.Name))

		case event.OnExtractorTypeFound:
			pterm.Println("; extractor type:", pterm.FgLightYellow.Sprintf("%s", e.Type))
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

	downloads := startDownload(resp.Media, directory, parallel)

	isFirstDuplicate := true
	_, remaining := shared.RemoveDuplicates(downloads, func(download shared.Download) {
		if isFirstDuplicate {
			pterm.Println("\n🚮 Removing duplicated downloads...")
			isFirstDuplicate = false
		}

		fileName := filepath.Base(download.FilePath)
		pterm.Printf("["+pterm.LightRed("D")+"] Deleting file %s\n", pterm.Bold.Sprintf(fileName))
	})

	shared.CreateReport(directory, remaining)

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
