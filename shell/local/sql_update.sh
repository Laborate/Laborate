if [ $1 == content ]
then
    cp ./sql_backups/update_content.sql.bz2 ./sql_backups/update_content2.sql.bz2
    bunzip2 ./sql_backups/update_content.sql.bz2
    /Applications/MAMP/Library/bin/mysql --user=root --password=bjv0623 code < ./sql_backups/update_content.sql
    mv ./sql_backups/update_content2.sql.bz2 ./sql_backups/update_content.sql.bz2
    rm ./sql_backups/update_content.sql
    echo "SQL Content and Structure Successfully Updated";
elif [ $1 == structure ]
then
    cp ./sql_backups/update_structure.sql.bz2 ./sql_backups/update_structure2.sql.bz2
    bunzip2 ./sql_backups/update_structure.sql.bz2
    /Applications/MAMP/Library/bin/mysql --user=root --password=bjv0623 code < ./sql_backups/update_structure.sql
    mv ./sql_backups/update_structure2.sql.bz2 ./sql_backups/update_structure.sql.bz2
    rm ./sql_backups/update_structure.sql
    echo "SQL Structure Successfully Updated";
fi