package main

import (
    "fmt"
    "github.com/pterm/pterm"
    "github.com/vegidio/umd-lib"
    "github.com/vegidio/umd-lib/event"
)

func startJob(
    url string,
    directory string,
    parallel int,
    limit int,
    extensions []string,
) error {
    spinner, _ := pterm.DefaultSpinner.Start("Some informational action...")
    spinner.Stop()

    u, err := umd.New(url, nil, func(ev event.Event) {
        switch e := ev.(type) {
        case event.OnExtractorFound:
            pterm.Print("\n🌎 Website found: ", pterm.FgLightGreen.Sprintf(e.Name))

        case event.OnExtractorTypeFound:
            pterm.Println("; extractor type:", pterm.FgLightYellow.Sprintf("%s", e.Type))
            pterm.Println("📝 Collecting", pterm.Bold.Sprintf("%d", limit), "media from",
                pterm.Bold.Sprintf("%s", e.Name))
        }
    })

    if err != nil {
        return err
    }

    resp, err := u.QueryMedia(limit, extensions, true)
    if err != nil {
        return err
    }

    fmt.Printf("Found %v media files\n", resp.Media)

    pterm.Println("\n🌟 Done!")
    return nil
}
