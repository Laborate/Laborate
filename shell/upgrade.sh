cd ~/middleware;
git checkout .;
git pull --rebase;

forever stopall;
standby start 80;

read -p "Hit enter when done migrating config.json: ";

forever start start.js;
standby stop 80;
