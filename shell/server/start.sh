#!/bin/bash

#Start and Preserve Node Server
#Send STDOUT to date coded log
nohup node server/node/nodeServer.js 1> "./server/node/logs/`(date +"%T_%m_%d_%Y")`.log" &

#Start Node
sudo /etc/init.d/apache2 start

#Show Address
echo http://208.68.39.56