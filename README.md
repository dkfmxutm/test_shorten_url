
**Shorten URL** is a set of Node.js that will allow you to run.

Quick Start
-----------
To get started, you need to install Node.js.
Also you need to install 3 modules from npm. 
1. body-parser
2. express
3. mysql

In order to use mysql database, you need to create database named kakaopay.
Also I createds shortUrlHistory table. I attached sql query below to create table.

CREATE TABLE `shortUrlHistory` (
`id` int(11) NOT NULL AUTO_INCREMENT,
  `shortUrlId` varchar(100) NOT NULL,
  `shorturl` varchar(100) NOT NULL,
  `longurl` varchar(1000) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

Lastly my application use 3000port. 

Type *http://localhost:3000/index* to access my application.

License
-------
Free software.

