drop database social;

CREATE DATABASE social;

USE social;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	score INT DEFAULT 0
);

CREATE TABLE characters (
    name VARCHAR(50) NOT NULL PRIMARY KEY,
    position INT NOT NULL,
    personality TEXT NOT NULL,  -- Short description of personality
    compliment_effect INT NOT NULL, -- Happiness change when given a compliment
    help_effect INT NOT NULL, -- Happiness change when offered help
    invite_effect INT NOT NULL -- Happiness change when invited
);

CREATE TABLE game_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_happiness INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE leaderboard (
    leaderboard_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    highest_score INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO characters (name, position, personality, compliment_effect, help_effect, invite_effect) 
VALUES
('Sam', 0, 'Likes compliments, dislikes help', 2, -1, 1),
('Alex', 1, 'Neutral, prefers invitations', 1, 0, 3),
('Jordan', 2, 'Enjoys help, dislikes compliments', -1, 3, 0),
('Suzy', 3, 'Likes Help, hates invitation', 1, 3, -4),
('Lynn', 4, 'Hater', -1, -1, -1),
('Vance', 5, 'Enjoys invites, and compliments', 1, -1, 2),
('Ray', 6, 'Loves invites, dislikes compliments', -2, 0, 3),
('Ervin', 7, 'Neutral, likes compliments', 1, 0, 0),
('Ruby', 8, 'Enjoys compliments, dislikes help', -1, 1, 2);