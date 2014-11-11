#!/bin/bash

    if [ "$TRAVIS_BRANCH" = "master" ]; then
		chmod 600 id_rsa
        eval `ssh-agent -s`
        ssh-add id_rsa
        cat .travis/known_hosts >> ~/.ssh/known_hosts
        git remote add dokku_main dokku@dev.songster-project.me:main
        git push dokku_main master --force
    else
        echo "not on master - no deployment started"
    fi 
