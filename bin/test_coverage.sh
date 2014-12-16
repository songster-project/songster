#!/bin/bash
echo "_____ starting backend tests _____"
./node_modules/mocha/bin/mocha -R dot $(find test/unit/backend -name '*.js')
echo "_____ backend testing finished _____"

echo "_____ starting frontend tests _____"
grunt karma:continuous
echo "_____ frontend testing finished _____"

echo "_____ starting server _____"
sudo Xvfb :10 -ac &  > /dev/null
export DISPLAY=:10  > /dev/null

echo "_____ setting up testdata _____"
./bin/importdb > /dev/null

echo "_____ starting integration tests _____"
./node_modules/mocha/bin/mocha -R dot $(find test/integration -name '*.js')
echo "_____ integration testing finished _____"

echo "_____ starting system tests _____"
./node_modules/protractor/bin/protractor test/localprotractor.config.js
echo "_____ system tests finished _____"