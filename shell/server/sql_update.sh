if [ $1 == content ]
then
    mysql -p Codelaborate < ./sql_backups/update_content.sql
    echo "SQL Content and Structure Successfully Updated";
elif [ $1 == structure ]
then
    mysql -p Codelaborate < ./sql_backups/update_structure.sql
    echo "SQL Structure Successfully Updated";
fi