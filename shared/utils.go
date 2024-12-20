package shared

import (
	"crypto/sha1"
	"fmt"
	"github.com/go-resty/resty/v2"
	"github.com/samber/lo"
	"github.com/spf13/afero"
	"path/filepath"
	"strconv"
)

var fs = afero.NewOsFs()

type Tag struct {
	Name string `json:"name"`
}

func IsOutdated(currentVersion string, repo string) bool {
	var tags []Tag
	var url = fmt.Sprintf("https://api.github.com/repos/%s/tags", repo)

	client := resty.New()
	resp, err := client.R().SetResult(&tags).Get(url)
	if err != nil || resp.StatusCode() != 200 {
		return true
	}

	return currentVersion != tags[0].Name
}

func CreateReport(directory string, downloads []Download) {
	filePath := filepath.Join(directory, "_report.md")
	file, err := fs.Create(filePath)
	if err != nil {
		return
	}

	defer file.Close()

	// Filter the failed downloads
	failedDownloads := lo.Filter(downloads, func(d Download, _ int) bool {
		return !d.IsSuccess
	})

	fileContent := "# UMD - Download Report\n\n"
	fileContent += "## Failed Downloads\n\n"
	fileContent += fmt.Sprintf("- Total: %d\n", len(failedDownloads))

	for _, download := range failedDownloads {
		fileContent += fmt.Sprintf("### 🔗 Link: %s - ❌ **Failure**\n", download.Url)
		fileContent += "### 📝 Error:\n"
		fileContent += "```\n"
		fileContent += fmt.Sprintf("%s\n", download.Error)
		fileContent += "```\n"
		fileContent += "---\n"
	}

	_, _ = file.WriteString(fileContent)
}

func RemoveDuplicates(downloads []Download, onDuplicateDeleted func(download Download)) (int, []Download) {
	numDeleted := 0
	remaining := make([]Download, 0)

	duplicates := lo.GroupBy(downloads, func(d Download) string {
		return d.Hash
	})

	for _, value := range duplicates {
		remaining = append(remaining, value[0])
		deleteList := value[1:]

		for _, deleteFile := range deleteList {
			numDeleted++
			_ = fs.Remove(deleteFile.FilePath)

			if onDuplicateDeleted != nil {
				onDuplicateDeleted(deleteFile)
			}
		}
	}

	return numDeleted, remaining
}

func CreateTimestamp(num int64) string {
	base36 := strconv.FormatInt(num, 36)
	return fmt.Sprintf("%06s", base36)
}

func CreateHashSuffix(str string) string {
	hash := sha1.Sum([]byte(str))
	return fmt.Sprintf("%x", hash)[:4]
}
