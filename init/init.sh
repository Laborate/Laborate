#Start Up
BASE="$(cd "$(dirname "$0")"; pwd)/../"

while [[ -z "$mysql_username" || -z "$mysql_password" ]]; do
    clear;
    read -p "MYSQL Username: " mysql_username;
    read -p "MYSQL Password: " mysql_password;
done

while [[ -z "$user_password" ]]; do
    clear;
    read -p "User's Password: " user_password;
done
clear;

#Install Apache2 Site
echo -e '\033[32mInstalling Apache2 Site\033[m'
sed "s/{{user_name}}/$(whoami)/g" "$BASE/init/code" > /etc/apache2/sites-available/code
a2ensite code
service apache2 reload
service apache2 restart
echo -e '\033[32mApache2 Site Install Complete\033[m'

#Populate Database
echo -e '\033[32mPopulating Database \033[m'
mysql --user="$mysql_username" --password="$mysql_password" -e "CREATE DATABASE code_$(whoami);"
mysql --user="$mysql_username" --password="$mysql_password" -e "GRANT ALL PRIVILEGES ON code_$(whoami).* To '$(whoami)';"
$BASE/shell/sql_update.sh content
echo -e '\033[32mDatabase Populated \033[m'

#Link Up Node Modules
echo -e '\033[32mLinking Node Modules \033[m'
cd $BASE
npm link mysql
npm link mysql-queues
npm link socket.io
echo -e '\033[32mLinked Node Modules \033[m'

#Install PHP Vendor Modules
echo -e '\033[32mInstalling PHP Vendor Modules \033[m'
cd $BASE/server/php/
cp $BASE/init/composer.json composer.json
curl -s http://getcomposer.org/installer | php
php composer.phar install
cd $BASE/server/php/vendor/
git clone https://github.com/Synchro/PHPMailer.git
git clone https://github.com/phpseclib/phpseclib.git
cp -r $BASE/server/php/vendor/phpseclib/phpseclib $BASE/server/php/vendor/phpseclib2
rm -r $BASE/server/php/vendor/phpseclib
mv $BASE/server/php/vendor/phpseclib2 $BASE/server/php/vendor/phpseclib
git clone https://github.com/mrclay/minify.git $BASE/server/php/vendor/minify/
mv $BASE/server/php/vendor/minify/min $BASE/server/php/vendor/min
rm -r $BASE/server/php/vendor/minify
echo -e '\033[32mPHP Vendor Modules Install Complete \033[m'

#Crontab
$BASE/shell/update_cron.sh

#Clean Up Install
echo -e '\033[32mCleaning Up Install \033[m'
rm $BASE/server/php/composer.lock
rm $BASE/server/php/composer.phar
rm $BASE/server/php/composer.json
mkdir $BASE/server/apache
mkdir $BASE/server/node/logs
echo -e '\033[32mInstaller Finished \033[m'
cd $BASE/../
exit