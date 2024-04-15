-- Author: Simone Gesualdi
-- Date: 04/04/2024
-- Description: This file defines the structure of our database
-- Version: 1.0
-- RDBMS: mysql

-- =======================
-- GENERAL RULES FOR THE CODE
-- =======================
-- 1. Use under_score instead of CamelCase;
-- 2. Table names should be plural;
-- 3. Specify the table of the id (id_name_table);
-- 4. Don't use weird names for fields or tables;
-- 5. Name foreign keys with the name they have in the referenced table;
-- 6. Use uppercase for SQL syntax.

CREATE TABLE IF NOT EXISTS roles(
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(20) NOT NULL CHECK (role_name IN ('admin', 'user'))
);

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    surname VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT REFERENCES rooms(room_id),
    date_day DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    user_id INT REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users_roles (
    user_role_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    role_id INT REFERENCES roles(role_id)
    UNIQUE (user_id, role_id)
);