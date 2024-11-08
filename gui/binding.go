package main

import (
	"github.com/vegidio/umd-lib"
	"github.com/vegidio/umd-lib/model"
)

func (a *App) QueryMedia(url string, limit int) ([]model.Media, error) {
	umdObj, err := umd.New(url, nil, func(event model.Event) {
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

	if err != nil {
		return make([]model.Media, 0), err
	}

	resp, err := umdObj.QueryMedia(limit, make([]string, 0))
	if err != nil {
		return make([]model.Media, 0), err
	}

	return resp.Media, nil
}
