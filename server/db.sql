CREATE DATABASE IF NOT EXISTS space_weather_simulation;

USE space_weather_simulation;

-- Admins Table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Students Table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    studentID VARCHAR(50) UNIQUE NOT NULL,
    progress INT DEFAULT 0,
    login_count INT DEFAULT 0
);

-- Quiz Questions Table
CREATE TABLE quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    answer VARCHAR(50) NOT NULL
);


INSERT INTO admins (first_name, last_name, username, email, password)
VALUES ('alina', 'clint', 'clintAlina', 'alina@gmail.com', 'Alina@123');

INSERT INTO admins (first_name, last_name, username, email, password)
VALUES ('samson', 'ubbani', 'samson123', 'samson@gmail.com', 'samson@123');
