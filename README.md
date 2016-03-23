MSUIF - Making Sense's UI Development Framework
==============

So, these are all the tasks we automatized in detail:


– grunt-contrib-connect
Creates a small server that serves the project in the development process.

– grunt-open
Opens the url of the server that Connect creates at the browser.

– grunt-contrib-watch
This task runs predefined tasks whenever watched file patterns are added, changed or deleted.

– grunt-bowercopy
By default, Bower downloads the dependencies on a single folder inside the project. Once Bower downloads all the technical dependencies, it relocates each one in different folders that we have previously specified.

– grunt-processhtml
ProcessHTML is a simple but powerful template engine.

– grunt-webfont
Webfont automatically creates an icon font from a collection of SVG files in a specific folder.

– grunt-shell
It lets us execute console commands directly from Grunt

– grunt-concurrent
As a default rule, Grunt executes only a single task at a time, but we found out that we needed to run two tasks at the same time to compile Sass and to Watch the files. Concurrent lets us run tasks simultaneously.

– grunt-contrib-copy
When the time comes to get the whole project ready to deploy, Copy creates a copy of the project so we can run optimization tasks but keeping the original files untouched.

– grunt-contrib-clean
One of the optimizations we run is Clean, which finds and cleans files that are not needed in production servers.

– grunt-contrib-concat
It’s a good practice to reduce the amount of HTTP Requests to optimize the website’s response delay. Concat merges related files (Javascript, CSS) into single files, obtaining less files that can be quickly downloaded by the server when a page is visited.

– grunt-contrib-uglify
This task minifies and drastically reduces file sizes by trimming out spaces and comments in the files.

– grunt-contrib-cssmin
Similarly to Uglify, CSSmin does the same but with CSS files.

– grunt-svgmin
It reduces the file size of the SVG files that Webfont uses to create icon fonts and the ones that we directly use in our HTML files.

– grunt-contrib-kraken
This task runs inside Grunt, the popular -and amazing- Kraken Image Optimizer. In their own words, “Kraken is a robust, ultra-fast image optimizer and compressor with best-in-class algorithms”. This service reduces around 60% of image filesize in almost every project that we develop.

– grunt-ftpush
Last but not least, FTPush pushes the production ready folder that we have created and largely optimized to a specific testing or production environment.


To run the proyect, just execute the command grunt run.
