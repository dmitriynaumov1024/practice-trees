create database if not exists MY_DATABASE;
use MY_DATABASE;

create table if not exists Trees (
  id int not null auto_increment,
  nodesEncoded text,
  primary key (id)
);

