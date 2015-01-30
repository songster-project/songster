# Songster
_You make the Party!_

## Description

Songster makes YOU a choose the music at parties. It enables you to influence the DJ's playlist.

Additionally you can also use it as a normal mediaplayer and store your music in the cloud to access it everywhere.

## Development

For the development environment, we are using [Vagrant](https://www.vagrantup.com/). This makes provisioning a development VM very easy:
```
# downloads the base image; install node/mongo/elasticsearch
vagrant up
```
**Note**: on some versions of windows, ``vagrant`` defaults to ``hyper-v`` as a host. if you want to use ``virtualbox`` do the following the first time:
```
vagrant up --provider=virtualbox
```

Afterwards you can enter the VM using ``vagrant ssh``. To stop the VM use ``vagrant halt``, to start ``vagrant up``. The base directory of the project is mounted at ``/vagrant`` in the VM.

To start songster do this:
```
vagrant ssh
cd /vagrant
sudo npm install -g grunt grunt-cli bower
npm install # add --no-bin-links if you run windows
bower install
grunt
npm start
```
Then open your browser at http://localhost:3000.

In case you want to live reload node, use one of the following:
 * pm2
 * forever
 * nodemon
 * node-supervisor (used by our production deployment)

Since the ``/vagrant`` folder is synced with your local project folder, you can use any native IDE you want. For example, you can simply open the project folder in [WebStorm](https://www.jetbrains.com/webstorm/).

## Deployment

The master branch can be deployed to a [dokku](https://github.com/progrium/dokku) instance. Doing this is quite simple:
```
git remote add dokku_main dokku@dev.songster-project.me:main
git push dokku_main master
```

This will:
 * push all changes on the **local** master branch to dokku
 * stop the running container
 * start a new container for NodeJS
 * link the mongo container to the new node container
 * link the elasticsearch container to the new node container
 * download the dependencies
 * execute ``npm start``

In case you want to setup your own dokku (for testing) you can do it like this (tested on ubuntu 14.04):
```
# install dokku itself - execute twice if necessary
wget -qO- https://raw.github.com/progrium/dokku/v0.2.3/bootstrap.sh | sudo DOKKU_TAG=v0.2.3 bash

# install mongo and supervisord dokku plugins
cd /var/lib/dokku/plugins/
git clone https://github.com/statianzo/dokku-supervisord
git clone https://github.com/jeffutter/dokku-mongodb-plugin
git clone https://github.com/rlaneve/dokku-link
git clone https://github.com/jezdez/dokku-elasticsearch-plugin elasticsearch

# takes a long time
dokku plugins-install

# setup mongodb
dokku mongodb:start
dokku mongodb:create node-js-app
```

On the client (not for songster but for a simple test project):
```
git clone https://github.com/heroku/node-js-sample
cd node-js-sample
cat ~/.ssh/id_rsa.pub | ssh root@dev.songster-project.me "sudo sshcommand acl-add dokku nodetest" 
git remote add nodetest dokku@dev.songster-project.me:node-js-app
git push nodetest master
```

Note: sometimes you need to [update the buildstep](http://progrium.viewdocs.io/dokku/upgrading).

##  Developers
 * Lisa Fichtinger
 * [Manuel Geier](http://geier.io)
 * Markus Zisser
 * [Martin Schleiss](http://martinschleiss.com)
 * Patrick Säuerl
 * [Thomas Rieder](http://rieder.io)

## Disclaimer

This project was created during the "Advanced Software Engineering" course at Vienna Unviersity of Technology in winter 2014.
