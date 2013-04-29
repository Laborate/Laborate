#!/bin/bash
BASE="$(cd "$(dirname "$0")"; pwd)/../"

cat $BASE/cron/* | crontab