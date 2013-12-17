#!/bin/bash

cd ~/middleware;

#Copy File
cp ./config.tmp.json ./config.json;

#Wait For User Input
echo -e "\e[34mPlease fill out the config.json file\033[m"
echo -e "\e[31mHit enter when finished\033[m"
read

#Activate Submodules
git submodule init
git submodule update

#Node Modules
npm install

#Start Server
cd ~/middleware;
forever start start.js

#Install Complete
echo -e "\033[32mInstall Complete\033[m"
