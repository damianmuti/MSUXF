MSUIF - Making Sense's UI Development Framework
==============

So, these are all the tasks we automatized in detail:

#### grunt-webfont

Webfont automatically creates an icon font from a collection of SVG files in a specific folder.

#### grunt-open

Opens the url of the server that Connect creates at the browser.

#### grunt-concurrent

As a default rule, Grunt executes only a single task at a time, but we found out that we needed to run two tasks at the same time to compile Sass and to Watch the files. Concurrent lets us run tasks simultaneously.

#### grunt-contrib-watch

This task runs predefined tasks whenever watched file patterns are added, changed or deleted.

#### grunt-contrib-copy

When the time comes to get the whole project ready to deploy, Copy creates a copy of the project so we can run optimization tasks but keeping the original files untouched.

#### grunt-contrib-connect

Creates a small server that serves the project in the development process.

#### grunt-contrib-kraken

This task runs inside Grunt, the popular -and amazing- Kraken Image Optimizer. In their own words, “Kraken is a robust, ultra-fast image optimizer and compressor with best-in-class algorithms”. This service reduces around 60% of image filesize in almost every project that we develop.

#### grunt-sftp-deploy

This is a grunt task for code deployment over the sftp protocol. It is mostly a copy of grunt-ftp-deploy, but uses ssh2 to provide sftp access instead of jsftp. And when I say "mostly a copy," I mean I stole it all and added sftp. Including this readme, for now

#### grunt-sass

This task uses libsass, which is a Sass compiler in C++. It's a lot faster than the original Ruby compiler and fully compatible.

#### grunt-postcss

Apply several post-processors to your CSS using PostCSS.

#### grunt-processhtml

ProcessHTML is a simple but powerful template engine.

#### grunt-bowercopy

By default, Bower downloads the dependencies on a single folder inside the project. Once Bower downloads all the technical dependencies, it relocates each one in different folders that we have previously specified.

#### grunt-contrib-uglify
 
This task minifies and drastically reduces file sizes by trimming out spaces and comments in the files.

To run the project, just execute the command: 
```Bash
grunt run
```