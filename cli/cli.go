package main

import (
	"cli/internal/charm"
	"fmt"
	"github.com/samber/lo"
	log "github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
	"github.com/vegidio/shared"
	"io"
	"os"
	"strings"
)

func main() {
	// Disable logging
	log.SetOutput(io.Discard)

	var url string
	var directory string
	var parallel int
	var limit int
	var noCache bool

	currentPath, _ := os.Getwd()
	extensions := make([]string, 0)

	app := &cli.App{
		Name:            "umd-dl",
		Usage:           "a CLI tool to easily download media hosted on popular websites",
		UsageText:       "umd-dl [options] [url]",
		Version:         shared.Version,
		HideHelpCommand: true,
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:        "dir",
				Aliases:     []string{"d"},
				Value:       currentPath,
				Usage:       "directory where the files will be saved",
				Destination: &directory,
				Category:    "Optional:",
				DefaultText: "current directory",
			},
			&cli.IntFlag{
				Name:        "parallel",
				Aliases:     []string{"p"},
				Value:       5,
				Usage:       "the number of downloads to be done in parallel",
				Destination: &parallel,
				Category:    "Optional:",
				DefaultText: "5",
				EnvVars:     []string{"UMD_PARALLEL"},
				Action: func(context *cli.Context, i int) error {
					if i < 1 || i > 10 {
						return fmt.Errorf("the number of parallel downloads; should be between 1-10")
					}
					return nil
				},
			},
			&cli.IntFlag{
				Name:        "limit",
				Aliases:     []string{"l"},
				Value:       99_999,
				Usage:       "the maximum number of files to be downloaded",
				Destination: &limit,
				Category:    "Optional:",
				EnvVars:     []string{"UMD_LIMIT"},
				DefaultText: "99.999",
				Action: func(context *cli.Context, i int) error {
					if i < 1 {
						return fmt.Errorf("the max number of downloads; should be at least 1")
					}
					return nil
				},
			},
			&cli.StringFlag{
				Name:        "extensions",
				Aliases:     []string{"e"},
				Value:       "",
				Usage:       "filter the downloads to only certain file extensions, separated by comma",
				Category:    "Optional:",
				EnvVars:     []string{"UMD_EXTENSIONS"},
				DefaultText: "all extensions",
				Action: func(context *cli.Context, s string) error {
					split := strings.Split(s, ",")

					split = lo.Map(split, func(ext string, _ int) string {
						return strings.ToLower(strings.TrimSpace(ext))
					})

					extensions = append(extensions, split...)
					return nil
				},
			},
			&cli.BoolFlag{
				Name:        "no-cache",
				Value:       false,
				Usage:       "ignore the cached media URLs, querying a fresh list of files",
				Destination: &noCache,
				Category:    "Optional:",
				EnvVars:     []string{"UMD_NO_CACHE"},
			},
		},
		Action: func(ctx *cli.Context) error {
			if ctx.NArg() > 0 {
				url = ctx.Args().Get(0)
			}

			fullDir, err := expandPath(directory)
			if err != nil {
				return fmt.Errorf("directory path %s is invalid", directory)
			}

			isOutdated := shared.IsOutdated(shared.Version, "vegidio/umd-app")
			if isOutdated {
				charm.PrintNewVersion(
					"A new version of UMD is available; please update at:",
					"https://github.com/vegidio/umd-app/releases",
				)
			}

			err = startQuery(
				url,
				fullDir,
				parallel,
				limit,
				extensions,
				noCache,
			)

			return err
		},
	}

	if err := app.Run(os.Args); err != nil {
		charm.PrintError(err.Error())
	}
}
