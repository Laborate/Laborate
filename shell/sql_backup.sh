#!/bin/bash
BASE="$(cd "$(dirname "$0")"; pwd)/../"

rm $BASE/sql_backups/*
mysqldump --user="root" --password="bjv0623" code --hex-blob > $BASE/sql_backups/update_content.sql
bunzip2 --compress $BASE/sql_backups/update_content.sql
mysqldump -d --user="root" --password="bjv0623" code --hex-blob > $BASE/sql_backups/update_structure.sql
bunzip2 --compress $BASE/sql_backups/update_structure.sql