package main

import (
	"fmt"
	"github.com/pterm/pterm"
)

func SprintError(message string, a ...interface{}) string {
	format := fmt.Sprintf(message, a...)
	return pterm.Sprintf(pterm.Red("🧨 %s"), format)
}

func PrintError(message string, a ...interface{}) {
	pterm.Printf(SprintError(message, a...))
}
