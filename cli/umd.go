package main

import (
    "cli/internal/spinner"
    "context"
    "fmt"
    "github.com/pterm/pterm"
    "github.com/vegidio/umd-lib"
    "github.com/vegidio/umd-lib/event"
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
            spinner.UpdateSpinner(msg, queryCount)

        case event.OnQueryCompleted:
            stopSpinner()
        }
    })

    if err != nil {
        return err
    }

    resp, err := u.QueryMedia(limit, extensions, true)
    if err != nil {
        return err
    }
    
    time.Sleep(250 * time.Millisecond)

    fmt.Printf("Found %d media files\n", len(resp.Media))

    pterm.Println("\n🌟 Done!")
    return nil
}
