# Universal Media Downloader (UMD)

<p align="center">
<img src="assets/icon.avif" width="300" alt="Universal Media Downloader (UMD)"/>
<br/>
<strong>UMD</strong> is an app to easily download media files hosted on popular websites.
<br/>
It supports the following sites:
<br/><br/>
<a href="https://coomer.su" target="_blank"><img src="https://img.shields.io/badge/Coomer-1392F4?&style=for-the-badge&logo=onlyfans&logoColor=white"/></a>
<a href="https://www.reddit.com" target="_blank"><img src="https://img.shields.io/badge/Reddit-FF4500?&style=for-the-badge&logo=reddit&logoColor=white"/></a>
<a href="https://www.redgifs.com" target="_blank"><img src="https://img.shields.io/badge/RedGifs-764ABC?&style=for-the-badge&logo=codeigniter&logoColor=white"/></a>
</p>

## 🎥 Demo

[![asciicast](https://asciinema.org/a/rH7Vb6r8RHtjPa4xuyTcr5o8s.svg)](https://asciinema.org/a/rH7Vb6r8RHtjPa4xuyTcr5o8s)

## 🖼️ Usage

There are 2 ways to use this app: through the CLI tool or using Docker. Here are some points to consider to help you choose which solution is best for you:

1. **CLI tool**: this is quick and easier way to use **UMD** however you must make sure that you have some dependencies installed in your computer if you want **UMD** to convert the downloaded media for you.

    - _Dependencies:_ Install [libavif](https://github.com/AOMediaCodec/libavif) and [FFmpeg](https://www.ffmpeg.org/download.html) (both optional) before using the CLI tool. You can verify if all dependencies are properly installed by running the command `umd check-deps`.

2. **Docker**: if you don't want to worry about installing dependencies in your computer before using **UMD** then the Docker version is probably better since it comes with all the dependencies ready to use.

### CLI Tool

Download the [latest version](https://github.com/vegidio/umd-app/releases) of **UMD** that matches your computer architecture and operating system. Extract the .zip file somewhere and then run the command below in the terminal:

```
$ umd <url> -d /Downloads/UMD
```

Where:

-   `<url>` (mandatory): the URL of the website where the media is hosted.
-   `-d` (optional): the directory where you want the files to be saved; default is the current directory.
-   `--limit` (optional): the maximum number of files to download; default is no limit.

For the full list of parameters, type `umd --help` in the terminal.

### Docker

Install [Docker](https://docs.docker.com/get-docker/) in your computer, then run the command below:

```
$ docker run --rm -t \
    -e UMD_URL=https://www.reddit.com/user/atomicbrunette18 \
    -v "/path/in/your/computer:/tmp/umd" \
    ghcr.io/vegidio/umd
```

Where:

-   `-e UMD_URL`: (mandatory): the URL of the website where the media is hosted.
-   `-e UMD_LIMIT` (optional): the maximum number of files to download; default is no limit.

#### Volume

For those that are not familiar with Docker, the `-v` (volume) parameter defines where the media will be saved, and it's divided in two parts, separated by the colon sign `:`. You just need to worry about the first part, on the left side of the colon sign (**don't change anything on the right side**) and update it according to a path in your computer where you want the media to be downloaded.

For example, if you want to download the media in the directory `/Downloads/UMD` then the volume parameter should look like this `-v "/Downloads/UMD:/tmp/umd"`.

## 💡 Features

### Remove duplicates

This application will automatically delete all files that are identical.

### File filtering

You can filter the files that you want to download based on their extension, separated by comma. To do that you must:

-   **CLI tool:** add the parameter `--extensions`; for example: `--extensions jpg,jpeg`.

-   **Docker:** add the environment variable `-e UMD_EXTENSIONS`; for example: `-e UMD_EXTENSIONS=jpg,jpeg`.

### Convert images/videos (coming soon...)

You can convert the media downloaded to better formats (AVIF for images and AV1 for videos); this will make the files smaller but preserving the same quality. To do that you must:

-   **CLI tool:** add the parameters `--convert-images` and/or `--convert-videos`, depending on what you need.

-   **Docker:** add the environment variables `-e UMD_CONVERT_IMAGES=true` and/or `-e UMD_CONVERT_VIDEOS=true` when you run the container.

## 🛠️ Build

In the project's root folder run in the CLI:

Gradle:

```
$ ./gradlew assemble
```

Docker:

```
$ docker build -t ghcr.io/vegidio/umd . --build-arg="VERSION=24.5.0"
```

## 📈 Telemetry

This app collects information about the data that you're downloading to help me track bugs and improve the general stability of the software.

**No identifiable information about you or your computer is tracked.** But if you still want to stop the telemetry, you can do that by adding the flag `--no-telemetry` in the CLI tool or the environment variable `-e UMD_TELEMETRY=false` when you run the Docker container.

## 📝 License

**UMD** is released under the MIT License. See [LICENSE](LICENSE) for details.

## 👨🏾‍💻 Author

Vinicius Egidio ([vinicius.io](http://vinicius.io))
