package spinner

import (
	"context"
	"github.com/pterm/pterm"
	"time"
)

var spinnerText = ""
var spinnerNumber = 0
var spinnerSequence = []string{"⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"}
var spinnerArea *pterm.AreaPrinter

func CreateSpinner(text string, number int) context.CancelFunc {
	spinnerText = text
	spinnerNumber = number
	ctx, cancel := context.WithCancel(context.Background())

	spinnerArea, _ = pterm.DefaultArea.Start()
	go StartSpinner(ctx)

	return cancel
}

func StartSpinner(ctx context.Context) {
	counter := 0
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			spinnerArea.Update(pterm.Sprintf("%s %s %s %s", spinnerText, pterm.FgRed.Sprintf("■"), pterm.Bold.Sprintf("%d", spinnerNumber), "Found"))
			spinnerArea.Stop()
			pterm.Println("\n")
			return
		case <-ticker.C:
			spin := pterm.FgRed.Sprintf(spinnerSequence[counter%len(spinnerSequence)])

			if spinnerNumber == 0 {
				spinnerArea.Update(pterm.Sprintf("%s %s", spinnerText, spin))
			} else {
				spinnerArea.Update(pterm.Sprintf("%s %s %s", spinnerText, spin, pterm.Bold.Sprintf("%d", spinnerNumber)))
			}

			counter++
			if counter == len(spinnerSequence) {
				counter = 0
			}
		}
	}
}

func UpdateSpinner(text string, number int) {
	spinnerText = text
	spinnerNumber = number
}
