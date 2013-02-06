if [ $1 == content ]
then
    /Applications/MAMP/Library/bin/mysql --user=root --password=bjv0623 Codelaborate < ./sql_backups/update_content.sql
    echo "SQL Content and Structure Successfully Updated";
elif [ $1 == structure ]
then
    /Applications/MAMP/Library/bin/mysql --user=root --password=bjv0623 Codelaborate < ./sql_backups/update_structure.sql
    echo "SQL Structure Successfully Updated";
fi