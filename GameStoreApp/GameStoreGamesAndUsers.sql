INSERT INTO games VALUES (1, 1, 'Madden.jpg', 'Madden NFL 2022', 47.99, 4.1, 'August 20, 2021');
INSERT INTO games VALUES (2, 1, 'NBA2k.jpg', 'NBA 2K23', 35.99, 2.8, 'September 4, 2022');
INSERT INTO games VALUES (3, 1, 'SanAndreas.jpg', 'Grand Theft Auto: San Andreas', 50.99, 4.2, 'October 26, 2004');
INSERT INTO games VALUES (4, 1, 'NFL_Street_2.jpg', 'NFL Street 2', 35.99, 3.7, 'December 22, 2004');
INSERT INTO games VALUES (5, 1, 'DubEdition.jpg', 'Midnight Club 3: Dub Edition', 39.99, 4.8, 'April 11, 2005');
INSERT INTO games VALUES (6, 1, 'Call_of_Duty.png', 'Call of Duty: World at War', 25.99, 3.5, 'November 11, 2008');
INSERT INTO games VALUES (7, 1, 'Halo.jpg', 'Halo 3', 35.99, 1.0, 'September 25, 2007');
INSERT INTO games VALUES (8, 1, 'Spiderman.jpg', 'Spiderman: Miles Morales', 49.99, 3.5, 'November 12, 2020');
INSERT INTO games VALUES (9, 1, 'NeedForSpeed.jpg', 'Need for Speed Underground 2', 22.99, 3.5, 'November 9, 2004');
INSERT INTO games VALUES (10, 1, 'Fortnite.jpg', 'Fortnite', 9.99, 2.5, 'July 25, 2017');
SELECT setval(pg_get_serial_sequence('games', 'game_id'), (SELECT MAX(game_id) FROM games));

DELETE FROM games;

INSERT INTO users VALUES (1, 'Billy Bob', 'bbob123@gmail.com', 'bbob123');
INSERT INTO users VALUES (2, 'John Doe', 'jdoe987@yahoo.com', 'jdoe987');
INSERT INTO users VALUES (3, 'Mary Jane', 'mjane357@gmail.com', 'mjane357');

DELETE FROM users;