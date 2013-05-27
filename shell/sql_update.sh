#!/bin/bash
BASE=~/code

mysql_password=$2;

while [[ -z "$mysql_password" ]]; do
    clear;
    read -p "MYSQL Password: " mysql_password;
    read -p "Is this information correct [Y/n]: " mysql_correct;

    if [ "$mysql_correct" == "n" ]; then
        mysql_password=;
    fi
done

if [ -z "$1" ]
then
    echo "Arguments: content & structure"
else
    if [ $1 == content ]
    then
        cp $BASE/sql_backups/update_content.sql.bz2 $BASE/sql_backups/update_content2.sql.bz2
        bunzip2 $BASE/sql_backups/update_content.sql.bz2
        mysql --user="$(whoami)" --password="$mysql_password" "laborate_$(whoami)" < $BASE/sql_backups/update_content.sql
        mv $BASE/sql_backups/update_content2.sql.bz2 $BASE/sql_backups/update_content.sql.bz2
        rm $BASE/sql_backups/update_content.sql
        echo "SQL Content and Structure Successfully Updated";
    elif [ $1 == structure ]
    then
        cp $BASE/sql_backups/update_structure.sql.bz2 $BASE/sql_backups/update_structure2.sql.bz2
        bunzip2 $BASE/sql_backups/update_structure.sql.bz2
        mysql --user="$(whoami)" --password="$mysql_password" "laborate_$(whoami)" < $BASE/sql_backups/update_structure.sql
        mv $BASE/sql_backups/update_structure2.sql.bz2 $BASE/sql_backups/update_structure.sql.bz2
        rm $BASE/sql_backups/update_structure.sql
        echo "SQL Structure Successfully Updated";
    else
        echo "Arguments: content & structure"
    fi
fi