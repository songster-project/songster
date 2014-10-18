# Songster
_You make the Party!_

## Description

Songster makes YOU a choose the music at parties. It enables you to influence the DJ's playlist.

Additionally you can also use it as a normal mediaplayer and store your music in the cloud to access it everywhere.

## Project structure

TODO a description of all folders and files

## Deploying

TODO a descripton for deployment will be added here once available

##  Developers
 * Lisa Fichtinger
 * [Manuel Geier](http://geier.io)
 * Markus Zisser
 * [Martin Schleiss](http://martinschleiss.com)
 * Patrick Säuerl
 * [Thomas Rieder](http://rieder.io)


## ngBoilerplate integration

We use the ngBoilerplate project (https://github.com/ngbp/ngbp) as a base for our AngularJS application. To integrate it into our NodeJS application we did the following:

* copied `karma/`, `src/`, `vendor/``.bowerrc`, `.gitmodules`, `bower.json`, `build.config.js`, `changelog.tpl` `Gruntfile.js`, `module.prefix`, `module.suffix`, `tools.md` to the root
* merged `package.json`, `.gitignore` files
* adjust `build.config.js` to deploy the app into `/public` instead of `bin`
* added a post script to install bower dependencies and run grunt:

    "scripts": {
      ...
      "postinstall" : "postinstall" : "npm install -g grunt bower && bower install && grunt
    },

## Disclaimer

This project was created during the "Advanced Software Engineering" course at Vienna Unviersity of Technology in winter 2014.
