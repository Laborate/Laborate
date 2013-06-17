#!/bin/bash
BASE=~/code

git submodule init
git submodule update

git update-index --assume-unchanged $BASE/config.json
