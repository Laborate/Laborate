#Start Up
BASE="$(cd "$(dirname "$0")"; pwd)/../"

#Update APT-GET
echo -e '\033[32mSystem Update \033[m'
apt-get -y update
apt-get -y install curl
apt-get -y install libssl-dev pkg-config build-essential curl gcc g++ checkinstall
echo -e '\033[32mUpdate Completed\033[m'

#Install FTP
echo -e '\033[32mInstalling FTP\033[m'
sudo apt-get -y install vsftpd
mv $BASE/init/vsftpd.conf /etc/vsftpd.conf
echo -e '\033[32mFTP Install Complete\033[m'

#Install Apache2
echo -e '\033[32mInstalling Apache2\033[m'
apt-get -y install apache2
echo -e '\033[32mApache2 Install Complete\033[m'

#Install Mysql
echo -e '\033[32mInstalling Mysql \033[m'
apt-get -y -y install mysql-server libapache2-mod-auth-mysql php5-mysql
mysql_install_db
echo -e '\033[32mMysql Install Complete \033[m'

#Install PHP
echo -e '\033[32mInstalling PHP \033[m'
apt-get -y install php5 libapache2-mod-php5
echo -e '\033[32mPHP Install Complete \033[m'

#Install PHP Modules
echo -e '\033[32mInstalling PHP Modules \033[m'
apt-get -y install php5-cgi php5-cli php5-common php5-curl php5-dbg php5-mcrypt
apt-get -y install php5-dev php5-mysql php5-odbc php5-fpm libphp5-embed
apt-get -y install php5-mysqlnd php5-memcache php5-imap php5-geoip php5-ldap
echo -e '\033[32mPHP Modules Install Complete \033[m'

#Install Nodes
echo -e '\033[32mInstalling Node \033[m'
mkdir /tmp/node-install
cd /tmp/node-install
wget http://nodejs.org/dist/v0.8.19/node-v0.8.19.tar.gz
tar -zxf node-v0.8.19.tar.gz
cd node-v0.8.19
./configure && make && checkinstall --install=yes --pkgname=nodejs --pkgversion "0.8.19" --default
cd $BASE
echo -e '\033[32mNode Install Complete \033[m'

#Install Node Modules
echo -e '\033[32mInstalling Node Modules \033[m'
npm install mysql
npm install mysql-queues
npm install socket.io
echo -e '\033[32mNode Modules Install Complete' \033[m

#Install Vendor Modules
echo -e '\033[32mInstalling Vendor Modules \033[m'
cd $BASE/server/php/
curl -s http://getcomposer.org/installer | php
php composer.phar install
cd $BASE
echo -e '\033[32mVendor Modules Install Complete \033[m'

#Install Vim
echo -e '\033[32mInstalling Vim \033[m'
apt-get -y remove vim-tiny
apt-get -y install vim
echo -e '\033[32mVim Install Complete \033[m'

#Configuring User Preferences
echo -e '\033[32mConfiguring User Preferences \033[m'
git config --global color.ui auto
git config --global core.editor "vim"
export VISUAL=vim
export EDITOR=vim
echo -e '\033[32mConfigured User Preferences \033[m'

#Update Database
echo -e '\033[32mUpdating Database \033[m'
cd $BASE
mysql -p -e "CREATE DATABASE Codelaborate"
cp $BASE/sql_backups/update_structure.sql.bz2 $BASE/sql_backups/update_structure2.sql.bz2
bunzip2 $BASE/sql_backups/update_structure.sql.bz2
mysql -p Codelaborate < $BASE/sql_backups/update_structure.sql
mv $BASE/sql_backups/update_structure2.sql.bz2 $BASE/sql_backups/update_structure.sql.bz2
rm $BASE/sql_backups/update_structure.sql
echo -e '\033[32mDatabase Updated \033[m'

#Clean Up Install
echo -e '\033[32mCleaning Up Install \033[m'
cd $BASE/server/php/
rm composer.lock
rm composer.phar
git update-index --assume-unchanged composer.json
rm composer.json
cd $BASE
git checkout .htaccess
git update-index --assume-unchanged init/init.sh
git update-index --assume-unchanged init/vsftpd.conf
rm -r init/
echo -e '\033[32mInstaller Finished \033[m'
exit