# OpenCourseWare Anti-downloader

_Made by [royalmo](https://github.com/royalmo) (Eric Roy) following a YouTube tutorial._


<p align="center">
  <img src="https://user-images.githubusercontent.com/49844173/158698760-a9dcbb61-3f0d-4b67-9af2-ef7eed17cdd1.png" alt="Logo iTIC" width="50%" />
</p>

<p align="center">
  <em>A Chrome extension that blocks the forced download of the files.</em>
</p>

## Contents
- [What is it?](#what-is-it)
- [Instalation](#instalation)
- [Usage](#usage)

## What is it?
This chrome extension replaces the `@@download` part of every link in the [ocwitic.epsem.upc.edu](https://ocwitic.epsem.upc.edu/) for `@@display-file` automaticlly. In other words, thanks to this extension, when you click on a file link, the file shows itself in the Chrome browser instead of downloading it.

It is very useful if you want to see multiple files. You just need to click them instead of downloading them all.

## Instalation
To be able to post a Chrome extension you need to pay 5$ to Google and as I'm not making money with this, you will have to follow these steps.
_However, if you pay me 5$ I can upload the extension to Google Chrome Web Store_ 🙂

### 1. Clone the repository

Assuming you have git installed, run
```
git clone https://github.com/royalmo/ocw-anti-download.git
```

Otherwise, you can [download the zip file](https://github.com/royalmo/ocw-anti-download/archive/refs/heads/main.zip) of the repository, and unzip the downloaded file.

### 2. Activate chrome developer mode

Go to [`chrome://extensions/`](chrome://extensions/) on your Chrome browser and enable **Developer mode** at the top right of the page.

![Developer mode](https://user-images.githubusercontent.com/49844173/158700807-1788513c-1581-482d-b9db-b12c30bb7774.png)

### 3. Load the extension folder

A **Load unpacked** button will appear at the top left of the page after enabling *Developer mode*. Click there, and select the *ocw-anti-download* folder you just cloned.

![Load unpacked](https://user-images.githubusercontent.com/49844173/158700864-62b51048-0768-4926-b1d7-272f7f4bbf97.png)


That's it! You should be able to open OCW's files without downloading them. **Caution!** Make sure you don't delete the downloaded folder! Chrome loads the extension from there every time you open the browser.

## Usage

Work in progess. For the moment there isn't any User Interface. Just enable/disable the extension on the extension menu.

![Enable disable](https://user-images.githubusercontent.com/49844173/158700931-b04a4108-1867-41d2-80a1-f2065b6d019f.png)
