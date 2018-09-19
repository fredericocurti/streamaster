DROP DATABASE IF EXISTS streamaster;
CREATE DATABASE streamaster;
USE streamaster;

CREATE TABLE User (
    user_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(128)  NOT NULL UNIQUE,
    username VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    thumbnail_url VARCHAR(512)
);

CREATE TABLE Follow ( -- mudou nome da tabela
	user_id1 INTEGER NOT NULL,
	user_id2 INTEGER NOT NULL,
    -- accepted BOOL NOT NULL, -- Deletar accepted
    foreign key (user_id1) REFERENCES User(user_id),
    foreign key (user_id2) REFERENCES User(user_id)
);

CREATE TABLE Playlist (
	playlist_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) DEFAULT 'New Playlist',
    is_public BOOL DEFAULT TRUE,
    user_id INT NOT NULL,
	foreign key (user_id) REFERENCES User(user_id)
    ON DELETE CASCADE -- on delete cascade adicionado
);

CREATE TABLE Track (
	track_id CHAR(32) NOT NULL PRIMARY KEY,
    source VARCHAR (256)  NOT NULL,
    title VARCHAR(256) NOT NULL ,
    artist VARCHAR(128),
    thumbnail_url  VARCHAR(512),
	url VARCHAR(512) NOT NULL,
    duration_ms INT
);

CREATE TABLE Playlist_has_track (
	track_id CHAR(32)  NOT NULL,
    playlist_id INT NOT NULL, -- id_playlist to  playlist_id
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	foreign key (track_id) REFERENCES Track(track_id),
    foreign key (playlist_id) REFERENCES Playlist(playlist_id)
);

CREATE TABLE Inbox (
	origin_user_id INT NOT NULL,
    destination_user_id INT NOT NULL,
    date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    playlist_id INT,
    track_id CHAR(32),
	foreign key (origin_user_id) REFERENCES User(user_id),
	foreign key (destination_user_id) REFERENCES User(user_id),
	foreign key (playlist_id) REFERENCES Playlist(playlist_id),
	foreign key (track_id) REFERENCES Track(track_id)
);


CREATE TABLE User_follows_playlist (
    playlist_id INT(11) NOT NULL, -- id_playlist to  playlist_id
    user_id INT(11) NOT NULL,
	foreign key (user_id) REFERENCES User(user_id),
    foreign key (playlist_id) REFERENCES Playlist(playlist_id) ON DELETE CASCADE
);


DELIMITER //

DROP PROCEDURE IF EXISTS InsertTrackToPlaylist;

CREATE PROCEDURE InsertTrackToPlaylist (source VARCHAR(256), title VARCHAR(256), artist VARCHAR(128), thumbnail_url VARCHAR(512), url VARCHAR(512), duration INT(11), playlist_id INT(11))
BEGIN

    DECLARE has_track, hash CHAR(32);

	SET hash = md5(CONCAT(source, url));

	SELECT track_id INTO has_track FROM Track WHERE track_id = hash;
    
	IF(has_track IS NULL) THEN 
		INSERT INTO Track VALUES (hash, source, title, artist, thumbnail_url, url, duration);
        INSERT INTO Playlist_has_track  (track_id, playlist_id) VALUES (hash, playlist_id);
	ELSE 
		INSERT INTO Playlist_has_track (track_id, playlist_id) VALUES (has_track, playlist_id);
	END IF;
    
    SELECT hash;
END
//

DELIMITER //

DROP PROCEDURE IF EXISTS checkTrackInbox;

CREATE PROCEDURE checkTrackInbox (source VARCHAR(256), title VARCHAR(256), artist VARCHAR(128), thumbnail_url VARCHAR(512), url VARCHAR(512), duration INT(11))
BEGIN

    DECLARE has_track, hash CHAR(32);

	SET hash = md5(CONCAT(source, url));

	SELECT track_id INTO has_track FROM Track WHERE track_id = hash;
    
	IF(has_track IS NULL) THEN 
		INSERT INTO Track VALUES (hash, source, title, artist, thumbnail_url, url, duration);
	END IF;
    
    SELECT hash;
END
//

