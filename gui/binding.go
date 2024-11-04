package main

import (
	"github.com/vegidio/umd-lib"
	"github.com/vegidio/umd-lib/model"
)

var umdObj *umd.Umd

func (a *App) QueryMedia(url string) []model.Media {
	umdObj, _ = umd.New(url, nil, func(event model.Event) {
		switch e := event.(type) {
		case model.OnExtractorFound:
			a.OnExtractorFound(e.Name)
		case model.OnExtractorTypeFound:
			a.OnExtractorTypeFound(e.Type, e.Name)
		case model.OnMediaQueried:
			a.OnMediaQueried(e.Amount)
		case model.OnQueryCompleted:
			a.OnQueryCompleted(e.Total)
		}
	})

	resp := umdObj.QueryMedia(100, []string{"mp4"})
	return resp.Media
}
