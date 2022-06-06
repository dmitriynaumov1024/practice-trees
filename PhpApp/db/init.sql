create database if not exists MY_DATABASE;
use MY_DATABASE;

create table if not exists Trees (
  id int not null auto_increment,
  primary key (id)
);

create table if not exists TreeNodes (
  id int not null auto_increment,
  parent int null,
  tree int not null,
  text varchar(99),
  primary key (id),
  foreign key (tree) 
    references Trees (id) 
    on delete cascade,
  foreign key (parent)
    references TreeNodes (id)
    on delete cascade
);
