docker exec mysql-db /usr/bin/mysqldump \
  -u root --password=MYSQL_ROOT_PASSWORD \
  MY_DATABASE > ./db/backup-$(date +%Y-%m-%d-%H-%M-%S).sql