#!/bin/bash
BASE="$(cd "$(dirname "$0")"; pwd)/../"

if [ -z "$1" ]
then
    echo "Arguments: start, stop & restart"
else
    if [ $1 == start ]
    then
        node $BASE/server/node/nodeServer.js > "$BASE//server/node/logs/`(date +"%T_%m_%d_%Y")`.log" &
        echo "Node Server Started"
    elif [ $1 == stop ]
    then
        killall node &
        echo "Node Server Stopped"
    elif [ $1 == restart ]
    then
        killall node &
        sleep 1
        node $BASE/server/node/nodeServer.js > "$BASE//server/node/logs/`(date +"%T_%m_%d_%Y")`.log" &
        echo "Node Server Restarted"
    else
        echo "Arguments: start, stop & restart"
    fi
fi