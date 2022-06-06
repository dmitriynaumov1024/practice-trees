# Practice
## Requirements
- Unix-like system
- npm (Node package manager)
- docker
- docker-compose

## Usage
- go to `PhpApp` directory
- execute `setup.sh` there
- execute `docker-compose up` there 
- navigate to [`http://localhost:8000`](http://localhost:8000) in your browser
- to dump a database, execute `dump.sh`, 
  result will be written to `db/backup<date-time>.sql`
- to remove containers and their volumes, 
  execute `docker rm --volumes php-apache mysql-db` 
  (be careful, there might be your containers with the same name)

## License
MIT License

## Copyright
&copy; 2022 Dmitriy Naumov naumov1024@gmail.com
