#!/bin/bash

#Kill Node Server
pkill node

#Start and Preserve Node Server
#Send STDOUT to date coded log
nohup node server/node/nodeServer.js 1> "./server/node/logs/`(date +"%T_%m_%d_%Y")`.log" &