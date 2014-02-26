#!/bin/bash

# Go To Repo Root
cd ~/middleware;

# Ask Inital Questions
read -p "Create API routes [Y/n]: " api;

# Create Directories
mkdir -p "./views/$1";
mkdir -p "./public/js/$1";
mkdir -p "./public/less/$1";

# Copy Template Files
cp "./views/template.html" "./views/$1/index.html";
cp -r "./public/js/template.js" "./public/js/$1/index.js";
cp -r "./public/less/template.less" "./public/less/$1/index.less";
cp -r "./routes/template" "./routes/site/$1";

# Enter New Info
sed -i "s/<replace>/$1/g" "./routes/site/$1/route.js";

# Create API Route
if [[ "$api" == "Y" || "$api" == "y" ]]; then
    cp -r "./routes/template" "./routes/api/$1";
    sed -i "s/<replace>/$1/g" "./routes/api/$1/route.js";
fi
