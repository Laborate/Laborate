#!/bin/bash
BASE="$(cd "$(dirname "$0")"; pwd)/../"

if [ -z "$1" ]
then
    echo "Arguments: content & structure"
else
    if [ $1 == content ]
    then
        cp $BASE/sql_backups/update_content.sql.bz2 $BASE/sql_backups/update_content2.sql.bz2
        bunzip2 $BASE/sql_backups/update_content.sql.bz2
        mysql --user="root" --password="bjv0623" code < $BASE/sql_backups/update_content.sql
        mv $BASE/sql_backups/update_content2.sql.bz2 $BASE/sql_backups/update_content.sql.bz2
        rm $BASE/sql_backups/update_content.sql
        echo "SQL Content and Structure Successfully Updated";
    elif [ $1 == structure ]
    then
        cp $BASE/sql_backups/update_structure.sql.bz2 $BASE/sql_backups/update_structure2.sql.bz2
        bunzip2 $BASE/sql_backups/update_structure.sql.bz2
        mysql --user="root" --password="bjv0623" code < $BASE/sql_backups/update_structure.sql
        mv $BASE/sql_backups/update_structure2.sql.bz2 $BASE/sql_backups/update_structure.sql.bz2
        rm $BASE/sql_backups/update_structure.sql
        echo "SQL Structure Successfully Updated";
    else
        echo "Arguments: content & structure"
    fi
fi