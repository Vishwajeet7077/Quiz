SET SQL_SAFE_UPDATES = 0;

CREATE DATABASE quizDB;
USE quizDB;

CREATE TABLE Users (
    id INT NOT NULL,
    name VARCHAR(30) NOT NULL,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    department VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE Test (
    test_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(30) NOT NULL,
    created_by_id INT NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    duration INT NOT NULL,         -- Duration of the test in minutes
    FOREIGN KEY (created_by_id) REFERENCES Users(id)
);


CREATE TABLE Questions (
    question_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(30),
    question_text TEXT,
    subject VARCHAR(30),
    image_url VARCHAR(255),  -- URL for storing images
    math_expression TEXT,    -- Field for storing mathematical expressions
    created_by_id INT NOT NULL,
    correct_option TEXT NOT NULL,  -- ID of the correct option
    option_1 TEXT NOT NULL,
    option_2 TEXT NOT NULL,
    option_3 TEXT NOT NULL,
    option_4 TEXT NOT NULL,
    FOREIGN KEY (created_by_id) REFERENCES Users(id)
);


CREATE TABLE Test_Question (
    test_id INT NOT NULL,
    question_id INT NOT NULL, 
    subject VARCHAR(30),
    PRIMARY KEY (test_id, question_id),
    FOREIGN KEY (test_id) REFERENCES Test(test_id),
    FOREIGN KEY (question_id) REFERENCES Questions(question_id)
);


CREATE TABLE Test_Records (
    record_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    coursename VARCHAR(100) NOT NULL,
    student_id INT NOT NULL,
    status ENUM('ongoing', 'terminated', 'completed') DEFAULT 'ongoing',
    marks INT,
    FOREIGN KEY (test_id) REFERENCES Test(test_id),
    FOREIGN KEY (student_id) REFERENCES Users(id)
);


SELECT * FROM Users;
SELECT * FROM Test;
SELECT * FROM Questions;
SELECT * FROM Test_Question;
SELECT * FROM Test_Records;


ALTER TABLE Users
MODIFY COLUMN password VARCHAR(100);