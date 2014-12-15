#!/bin/bash

echo "Going root"
sudo -i

echo "Updating package cache..."
apt-get update > /dev/null

echo "Installing Java..."
apt-get install openjdk-7-jre-headless -y

echo "Adding elasticsearch repo..."
wget -qO - http://packages.elasticsearch.org/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb http://packages.elasticsearch.org/elasticsearch/1.3/debian stable main
" >> /etc/apt/sources.list
apt-get update > /dev/null

echo "Installing elasticsearch..."
apt-get install elasticsearch -y

echo "Adding elasticsearch to autostart..."
update-rc.d elasticsearch defaults 95 10

echo "Starting elasticsearch..."
/etc/init.d/elasticsearch start

echo "Installing elasticsearch-head plugin as a frontend..."
/usr/share/elasticsearch/bin/plugin -install mobz/elasticsearch-head

echo "Adding MongoDB repo..."
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
apt-get -y update > /dev/null

echo "Installing MongoDB..."
apt-get install -y mongodb-10gen

echo "Adding NodeJS repo..."
add-apt-repository -y ppa:chris-lea/node.js
apt-get -y update > /dev/null

echo "Installing node.js..."
apt-get install -y nodejs git

echo "Installing firefox and Xvfb..."
apt-get install -y Xvfb firefox

echo "Installing ffmpeg..."
apt-add-repository -y ppa:jon-severinsson/ffmpeg
apt-get update
apt-get install -y ffmpeg libav-tools

echo "Finished provisioning. Elasticsearch: http://localhost:9200/_plugin/head/; NodeJS: http://localhost:3000"
