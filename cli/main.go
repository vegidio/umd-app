package main

import (
    "fmt"
    "github.com/samber/lo"
    "github.com/urfave/cli/v2"
    "os"
    "strings"
)

func main() {
    var url string
    var directory string
    var parallel int
    var limit int

    currentPath, _ := os.Getwd()
    extensions := make([]string, 0)

    app := &cli.App{
        Name:            "umd-dl",
        Usage:           "a CLI tool to easily download media files hosted on popular websites",
        UsageText:       "umd-dl -d [directory] [other options] [url]",
        Version:         "<version>",
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
                DefaultText: "all files",
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
                        return "." + strings.ToLower(strings.TrimSpace(ext))
                    })
                    split = lo.Filter(split, func(ext string, _ int) bool {
                        return len(ext) > 1
                    })

                    extensions = append(extensions, split...)
                    return nil
                },
            },
        },
        Action: func(cCtx *cli.Context) error {
            if cCtx.NArg() > 0 {
                url = cCtx.Args().Get(0)
            }

            fullDir, err := expandPath(directory)
            if err != nil {
                return fmt.Errorf("directory path %s is invalid", directory)
            }

            err = startQuery(
                url,
                fullDir,
                parallel,
                limit,
                extensions,
            )

            return err
        },
    }

    if err := app.Run(os.Args); err != nil {
        PrintError(err.Error())
    }
}
