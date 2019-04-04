#!/usr/bin/env bash

PROJECT_NAME=${1:-"carfab"}

cd ./network/basic-network/

docker-compose down

docker images -a | grep $PROJECT_NAME | awk '{print $3}' | xargs docker rmi -f