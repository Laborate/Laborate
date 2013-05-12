#!/bin/bash
BASE=~/code

clear;

git submodule init
git submodule update

$BASE/shell/update_cron.sh
$BASE/shell/sql_update.sh content
$BASE/shell/node_control.sh start
git update-index --assume-unchanged $BASE/config.json