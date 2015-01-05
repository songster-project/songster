#!/bin/bash

echo "_____ setting up testdata _____"
./bin/importdb > /dev/null

echo "_____ starting server _____"
npm start &
sleep 10

echo "_____ running grunt _____"
grunt > /dev/null

echo "_____ starting integration tests _____"
./node_modules/mocha/bin/mocha -R List $(find test/integration -name '*.js')
echo "_____ integration testing finished _____"