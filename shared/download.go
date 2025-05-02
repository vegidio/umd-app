package shared

import (
	"fmt"
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
) <-chan *fetch.Response {
	f := fetch.New(nil, 10)

	requests := lo.Map(media, func(m umd.Media, _ int) *fetch.Request {
		filePath := CreateFilePath(directory, m)
		request, _ := f.NewRequest(m.Url, filePath)
		return request
	})

	return f.DownloadFiles(requests, parallel)
}

func ResponseToDownload(response *fetch.Response) Download {
	bytes, _ := response.Bytes()

	return Download{
		Url:       response.Request.Url,
		FilePath:  response.Request.FilePath,
		Error:     response.Error(),
		IsSuccess: response.Error() == nil,
		Hash:      CreateFileHash(bytes),
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
