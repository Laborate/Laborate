#! /bin/bash
BASE="$(cd "$(dirname "$0")"; pwd)/../"

while inotifywait -e CLOSE_WRITE $BASE/server/node/*; do
    $BASE/shell/node_control.sh restart;
    clear;
    echo "Restarted Node";
done
