#!/bin/sh -e

#Start Up
BASE = "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#Login As root
sudo su

#Update APT-GET
echo 'System Update'
apt-get -y update
apt-get install curl
apt-get -y install libssl-dev pkg-config build-essential curl gcc g++ checkinstall
echo 'Update Completed'

#Install Apache2
echo 'Installing Apache2'
apt-get install apache2
echo 'Apache2 Install Complete'

#Install Mysql
echo 'Installing Mysql'
apt-get install mysql-server libapache2-mod-auth-mysql php5-mysql
mysql_install_db
echo 'Mysql Install Complete'

#Install PHP
echo 'Installing PHP'
apt-get install php5 libapache2-mod-php5
echo 'PHP Install Complete'

#Install PHP Modules
echo 'Installing PHP Modules'
apt-get install php5-cgi php5-cli php5-common php5-curl php5-dbg php5-mcrypt
apt-get install php5-dev php5-mysql php5-odbc php5-fpm libphp5-embed
apt-get install php5-mysqlnd php5-memcache php5-imap php5-geoip php5-ldap
echo 'PHP Modules Install Complete'

#Install Nodes
echo 'Installing Node'
mkdir /tmp/node-install
cd /tmp/node-install
wget http://nodejs.org/dist/v0.8.19/node-v0.8.19.tar.gz
tar -zxf node-v0.8.19.tar.gz
cd node-v0.8.19
./configure && make && checkinstall --install=yes --pkgname=nodejs --pkgversion "0.8.19" --default
cd $BASE
echo 'Node Install Complete'

#Install Node Modules
echo 'Installing Node Modules'
npm install mysql
npm install mysql-queues
npm install socket.io
echo 'Node Modules Install Complete'

#Install Vendor Modules
echo 'Installing Vendor Modules'
cd $BASE/server/php/
curl -s http://getcomposer.org/installer | php
php composer.phar install
cd $BASE
echo 'Vendor Modules Install Complete'

#Install Vim
echo 'Installing Vim'
apt-get remove vim-tiny
apt-get install vim
echo 'Vim Install Complete'

#Configuring User Preferences
git config --global color.ui auto
git config --global core.editor "vim"
export VISUAL=vim
export EDITOR=vim

#Clean Up Install
cd $BASE/server/php/
rm composer.lock
rm composer.phar
git update-index --assume-unchanged composer.json
rm composer.json
cd $BASE
git update-index --assume-unchanged init.sh
rm $0
echo 'Installer Finished'