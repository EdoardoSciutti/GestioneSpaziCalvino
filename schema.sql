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

CREATE TABLE IF NOT EXISTS companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(50) NOT NULL,
    city VARCHAR(20) NOT NULL,
    country VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    surname VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    company_id INT REFERENCES companies(company_id),
    role INT REFERENCES roles(role_id),
    password VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT REFERENCES companies(company_id),
    date_day DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
);