#!/bin/bash
BASE=~/code

mysql_password=$1;

while [[ -z "$mysql_password" ]]; do
    clear;
    read -p "MYSQL Password: " mysql_password;
    read -p "Is this information correct [y,n]: " mysql_correct;

    if [ "$mysql_correct" == "n" ]; then
        mysql_password=;
    fi
done

rm $BASE/sql_backups/*
mysqldump --user="$(whoami)" --password="$mysql_password" "laborate_$(whoami)" --hex-blob > $BASE/sql_backups/update_content.sql
bunzip2 --compress $BASE/sql_backups/update_content.sql
mysqldump -d --user="$(whoami)" --password="$mysql_password" "laborate_$(whoami)" --hex-blob > $BASE/sql_backups/update_structure.sql
bunzip2 --compress $BASE/sql_backups/update_structure.sql