#!/bin/bash
BASE="$(cd "$(dirname "$0")"; pwd)/../"

if [ -z "$1" ]; then
    echo "Arguments: start, stop & restart"
else
    if [ "$1" == "start" ]; then
        cd $BASE;
        forever start $BASE/start.js;
        echo "Node Server Started"
    elif [ "$1" == "stop" ]; then
        forever stop 0;
        echo "Node Server Stopped"
    elif [ "$1" == "restart" ]; then
        forever stop 0;
        sleep 1
        forever start $BASE/start.js;
        echo "Node Server Restarted"
    else
        echo "Arguments: start, stop & restart"
    fi
fi