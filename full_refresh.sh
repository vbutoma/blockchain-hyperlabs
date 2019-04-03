#!/usr/bin/env bash

cd dev-servers

./stopFabric.sh

sleep 1

pkill composer-playground
rm -rf ~/.composer

./teardownFabric.sh

sleep 1

./startFabrics.sh
./createPeerAdminCard.sh