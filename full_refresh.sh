#!/usr/bin/env bash

PROJECT_NAME=${1:-"carfab"}
FORCE=${2:-false}

echo $PROJECT_NAME
echo $FORCE

if [[ $FORCE = true ]]; then
    ./downFabric.sh $PROJECT_NAME
    sleep 1
fi

./startFabric.sh $PROJECT_NAME

sleep 2

# remove wallet folder content
rm -r wallet/*

node app/enrollAdmin.js
node app/registerUsers.js
