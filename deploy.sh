#!/bin/bash

    branch_name=$(git symbolic-ref -q HEAD)
    branch_name=${branch_name##refs/heads/}
    branch_name=${branch_name:-HEAD}

    echo $branch_name

    if [ "$branch_name" = "master" ]; then
		chmod 600 id_rsa
        eval `ssh-agent -s`
        ssh-add id_rsa
        cat .travis/known_hosts >> ~/.ssh/known_hosts
        git remote add dokku_main dokku@dev.songster-project.me:main
        git push dokku_main master 
    else
        echo "not on master - no deployment started"
    fi 