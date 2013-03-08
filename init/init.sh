#Start Up
BASE="$(cd "$(dirname "$0")"; pwd)/../"

#Install Apache2 Site
echo -e '\033[32mInstalling Apache2 Site\033[m'
cp $BASE/init/code /etc/apache2/sites-available/code
a2ensite code
$BASE/shell/server/restart.sh
echo -e '\033[32mApache2 Site Install Complete\033[m'

#Populate Database
echo -e '\033[32mPopulating Database \033[m'
mysql --user="root" --password="bjv0623" -e "CREATE DATABASE code"
cp $BASE/sql_backups/update_content.sql.bz2 $BASE/sql_backups/update_content2.sql.bz2
bunzip2 $BASE/sql_backups/update_content.sql.bz2
mysql --user="root" --password="bjv0623" code < $BASE/sql_backups/update_content.sql
mv $BASE/sql_backups/update_content2.sql.bz2 $BASE/sql_backups/update_content.sql.bz2
rm $BASE/sql_backups/update_content.sql
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
git clone https://github.com/phpseclib/phpseclib.git
cp -r $BASE/server/php/vendor/phpseclib/phpseclib $BASE/server/php/vendor/phpseclib2
rm -r $BASE/server/php/vendor/phpseclib
mv $BASE/server/php/vendor/phpseclib2 $BASE/server/php/vendor/phpseclib
echo -e '\033[32mPHP Vendor Modules Install Complete \033[m'

#Clean Up Install
echo -e '\033[32mCleaning Up Install \033[m'
rm $BASE/server/php/composer.lock
rm $BASE/server/php/composer.phar
rm $BASE/server/php/composer.json
mkdir $BASE/server/apache
mkdir $BASE/server/node/logs
ln -s $BASE/server/php/min $BASE/public_html/min
echo -e '\033[32mInstaller Finished \033[m'
cd $BASE/../
exit