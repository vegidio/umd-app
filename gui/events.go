package main

import (
    "github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) OnExtractorFound(name string) {
    runtime.EventsEmit(a.ctx, "OnExtractorFound", name)
}

func (a *App) OnExtractorTypeFound(eType string, name string) {
    runtime.EventsEmit(a.ctx, "OnExtractorTypeFound", eType, name)
}

func (a *App) OnMediaQueried(amount int) {
    runtime.EventsEmit(a.ctx, "OnMediaQueried", amount)
}

func (a *App) OnQueryCompleted(total int) {
    runtime.EventsEmit(a.ctx, "OnQueryCompleted", total)
}
