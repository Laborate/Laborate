#!/bin/bash

#Clear Screen
clear

#Wait For User Input
echo -e "\e[34mPlease fill out the config.json file\033[m"
echo -e "\e[31mHit enter when finished\033[m"
read
cd ~/code;

#Activate Submodules
git submodule init
git submodule update

#Ignore config.json Changes
git update-index --assume-unchanged ./config.json

#Node Modules
npm install

#Start Server
forever start start.js

#Clear Screen
clear

#Install Complete
echo -e "\e[33mInstall Complete\033[m"
