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

## 🖼️ Usage

There are 2 ways to use this app: using the GUI or the CLI.

The GUI is the easiest way to use the app, with an intuitive interface that allows you to download media files with just a few clicks. The CLI is more advanced and allows you to download media files in a more automated way.

Both versions are available for Windows, macOS, and Linux. Download the correct version that matches your computer architecture and operating system from the [latest release](https://github.com/vegidio/umd-app/releases) and follow the instructions below:

### GUI

<p align="center">
<img src="assets/gui-screenshot.avif" width="80%" alt="UMD - GUI"/>
</p>

1. `Enter a URL` of the website where the media is hosted and then click on the `Query` button. If the URL belongs to a website supported by **UMD**, it will query the website and show the media files in the list below.
    - Mark the checkbox `Deep` if you want to perform a deep search. This will expand the search in the unknown URLs in an attempt to find more media files.
    - You can limit the number of files that will be queried by entering a number in the `Limit` field.
2. Select the media files that you want to download by clicking on the checkbox next to the file name, or click on the checkboxes to automatically select all images and/or videos.
3. Click on the button `Browse` to select the directory where you want the files to be saved and then click on the `Download` button to start the download.

### CLI

Download the [latest version](https://github.com/vegidio/umd-app/releases) of **UMD** that matches your computer architecture and operating system. Extract the .zip file somewhere and then run the command below in the terminal:

```
$ umd <url> -d /Downloads/UMD
```

Where:

-   `<url>` (mandatory): the URL of the website where the media is hosted.
-   `-d` (optional): the directory where you want the files to be saved; default is the current directory.
-   `--limit` (optional): the maximum number of files to download; default is no limit.

For the full list of parameters, type `umd --help` in the terminal.

## 💣 Troubleshooting

### "App Is Damaged..." (Unidentified Developer)

For a couple of years now, Apple has decided to enforce developers to participate in their "Developer Program" so they can receive the allusive title _identified developer_ 😛

Translating to non-BS language, this means that if you're not a registered developer with Apple (i.e. paying them), I can't freely distribute software that I create for macOS because they won't and the users will see a message saying that the app is damaged and can't be opened.

To fix this, open the terminal and run the command below, making sure to update `/Applications/UMD.app` to point to the correct path where you've installed the app:

```bash
xattr -d com.apple.quarantine /Applications/UMD.app
```

## 📈 Telemetry

This app collects information about the data that you're downloading to help me track bugs and improve the general stability of the software.

**No identifiable information about you or your computer is tracked.** But if you still want to stop the telemetry, you can do that by adding the flag `--no-telemetry` in the CLI tool or the environment variable `-e UMD_TELEMETRY=false` when you run the Docker container.

## 📝 License

**UMD** is released under the MIT License. See [LICENSE](LICENSE) for details.

## 👨🏾‍💻 Author

Vinicius Egidio ([vinicius.io](http://vinicius.io))
