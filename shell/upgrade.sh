cd ~/middleware;

forever stopall;
standby start 80;

git checkout .;
git pull --rebase;
npm install;

read -p "Hit enter when done migrating config.json: ";

forever start start.js;
standby stop 80;
