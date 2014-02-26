#!/bin/bash

# Go To Repo Root
cd ~/middleware;

# Ask Inital Questions
read -p "Create API Routes [Y/n]: " api;
read -p "Create Public Assests [Y/n]: " assests;

# Create Directories
mkdir "./views/$1";

# Copy Template Files
cp "./views/template.html" "./views/$1/index.html";
cp -r "./routes/template" "./routes/site/$1";

# Enter New Info
sed -i "s/<replace>/$1/g" "./routes/site/$1/route.js";

# Create API Route
if [[ "$api" == "Y" || "$api" == "y" ]]; then
    cp -r "./routes/template" "./routes/api/$1";
    sed -i "s/<replace>/$1/g" "./routes/api/$1/route.js";
fi

# Create Public Assests
if [[ "$assests" == "Y" || "$assests" == "y" ]]; then
    name=$1;

    mkdir "./public/js/$1";
    mkdir "./public/less/$1";

    cp -r "./public/js/template.js" "./public/js/$1/index.js";
    cp -r "./public/less/template.less" "./public/less/$1/index.less";

    sed -i "/};/d" "./public/index.js";

    echo -e "\n\t/* ${name[@]^} */" >> "./public/index.js";
    echo -e "\tclientCSS.addFile('$1', css_path + '$1/index.less');" >> "./public/index.js";
    echo -e "\tclientJS.addFile('$1', js_path + '$1/index.js');" >> "./public/index.js";
    echo -e "};\n" >> "./public/index.js";
fi
