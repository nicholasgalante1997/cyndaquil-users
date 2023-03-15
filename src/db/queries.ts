export const QUERY_USERS_TEMPLATE = `SELECT * FROM users`;
export const QUERY_USER_TEMPLATE_BY_ID = `SELECT * FROM users WHERE user_id = ?`;
export const QUERY_USER_TEMPLATE_BY_EMAIL = `SELECT * FROM users WHERE email = ?`;

export const QUERY_USER_CARDS_TEMPLATE = `SELECT * FROM user_cards`;
export const QUERY_USER_CARDS_TEMPLATE_BY_USER_ID = `SELECT * FROM user_cards WHERE user_id = ?`;

export const QUERY_DATABASES = `show databases`;
export const QUERY_TABLES_IN_DATABASE = `show tables`;

export const USE_USERS_DATABASE_COMMAND = `USE users;`;

export const CREATE_USERS_DATABASE_IF_NOT_EXISTS_COMMAND = `CREATE DATABASE [IF NOT EXISTS] users`;
export const CREATE_USERS_TABLE_IF_NOT_EXISTS_COMMAND = `CREATE TABLE if not exists users (user_id VARCHAR(40), email VARCHAR(30), password_salted VARCHAR(50))`;
export const CREATE_USER_CARDS_TABLE_IF_NOT_EXISTS_COMMAND = `CREATE TABLE if not exists user_cards (user_id VARCHAR(40), card_id VARCHAR(11), user_card_id VARCHAR(40))`;

export const CREATE_USER_INSERT_COMMAND = `INSERT INTO users (user_id, email, salted_password) values (?, ?, ?);`
export const CREATE_USER_CARD_ASSOCIATION_INSERT_COMMAND = `INSERT INTO users (user_id, card_id, user_card_id) values (?, ?, ?);`