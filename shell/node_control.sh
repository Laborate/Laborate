#!/bin/bash
BASE=~/code

if [ -z "$1" ]; then
    echo "Arguments: start, stop & restart"
else
    if [ "$1" == "start" ]; then
        npm start > "$BASE/logs/`(date +"%T_%m_%d_%Y")`.log" &
        echo "Node Server Started"
    elif [ "$1" == "stop" ]; then
        npm stop &
        echo "Node Server Stopped"
    elif [ "$1" == "restart" ]; then
        npm stop &
        sleep 1
        npm start > "$BASE/logs/`(date +"%T_%m_%d_%Y")`.log" &
        echo "Node Server Restarted"
    else
        echo "Arguments: start, stop & restart"
    fi
fi

exit