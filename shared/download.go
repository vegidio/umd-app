package shared

import (
	"crypto/sha256"
	"fmt"
	"github.com/cavaliergopher/grab/v3"
	"github.com/samber/lo"
	"github.com/vegidio/umd-lib"
	"github.com/vegidio/umd-lib/fetch"
	"path/filepath"
	"time"
)

func DownloadAll(
	media []umd.Media,
	directory string,
	parallel int,
) <-chan *grab.Response {
	requests := lo.Map(media, func(m umd.Media, _ int) *grab.Request {
		filePath := CreateFilePath(directory, m)
		r, _ := grab.NewRequest(filePath, m.Url)
		return r
	})

	f := fetch.New(nil, 0)
	return f.DownloadFiles(requests, parallel)
}

func ResponseToDownload(response *grab.Response) Download {
	file, _ := response.Bytes()
	hash := fmt.Sprintf("%x", sha256.Sum256(file))

	return Download{
		Url:       response.Request.URL().String(),
		FilePath:  response.Filename,
		Error:     response.Err(),
		IsSuccess: response.Err() == nil,
		Hash:      hash,
	}
}

func CreateFilePath(directory string, media umd.Media) string {
	var t time.Time
	var err error

	n := media.Metadata["name"].(string)
	suffix := CreateHashSuffix(media.Url)

	// If array of Media is coming from the JS code, the values in the Metadata map are strings
	timeStr, ok := media.Metadata["created"].(string)
	if ok {
		t, err = time.Parse(time.RFC3339, timeStr)
		if err != nil {
			t = time.Now()
		}
	} else {
		t = media.Metadata["created"].(time.Time)
	}

	timestamp := CreateTimestamp(t.Unix())

	ext := media.Extension
	if ext == "" {
		ext = "unknown"
	}

	fileName := fmt.Sprintf("%s-%s-%s.%s", n, timestamp, suffix, ext)
	return filepath.Join(directory, fileName)
}
