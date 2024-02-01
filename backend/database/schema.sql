-- create table item (
--   id int unsigned primary key auto_increment not null,
--   title varchar(255) not null
-- );


CREATE TABLE `users` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `user_id` integer
);

CREATE TABLE `crew` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
);

ALTER TABLE `users` ADD FOREIGN KEY (`user_id`) REFERENCES `crew` (`id`);
