CREATE DATABASE social;

USE social;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE characters (
    character_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
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


CREATE TABLE actions (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    character_id INT,
    action_type ENUM('compliment', 'help', 'invite') NOT NULL,
    happiness_change INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(character_id) ON DELETE CASCADE
);

CREATE TABLE leaderboard (
    leaderboard_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    highest_score INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO characters (name, personality, compliment_effect, help_effect, invite_effect) 
VALUES
('Sam', 'Likes compliments, dislikes help', 2, -1, 1),
('Alex', 'Neutral, prefers invitations', 1, 0, 3),
('Jordan', 'Enjoys help, dislikes compliments', -1, 3, 0),
('Suzy', 'Likes Help, hates invitation', 1, 3, -4),
('Lynn', 'Hater', -1, -1, -1),
('Vance', 'Enjoys invites, and compliments', 1, -1, 2),
('Ray', 'Loves invites, dislikes compliments', -2, 0, 3),
('Ervin', 'Neutral, likes compliments', 1, 0, 0),
('Ruby', 'Enjoys compliments, dislikes help', -1, 1, 2);
