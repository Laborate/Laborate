#!/bin/bash
if [ $1 == start ]
then
    node server/node/nodeServer.js > "./server/node/logs/`(date +"%T_%m_%d_%Y")`.log" &
elif [ $1 == stop ]
then
    killall node &
elif [ $1 == restart ]
then
    killall node &
    sleep 1
    node server/node/nodeServer.js > "./server/node/logs/`(date +"%T_%m_%d_%Y")`.log" &
fi