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

CREATE TABLE Follow ( --mudou nome da tabela
	user_id1 INTEGER NOT NULL,
	user_id2 INTEGER NOT NULL,
    --accepted BOOL NOT NULL, -- Deletar accepted
    foreign key (user_id1) REFERENCES User(user_id),
    foreign key (user_id2) REFERENCES User(user_id)
);

CREATE TABLE Playlist (
	playlist_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) DEFAULT 'New Playlist',
    is_public BOOL DEFAULT TRUE,
    user_id INT NOT NULL,
	foreign key (user_id) REFERENCES User(user_id)
    --  ON DELETE CASCADE --on delete cascade adicionado
);

CREATE TABLE Track (
	track_id CHAR(32) NOT NULL PRIMARY KEY,
    source VARCHAR (256)  NOT NULL,
    title VARCHAR(256) NOT NULL ,
    artist VARCHAR(128),
    thumbnail_url  VARCHAR(512),
	url VARCHAR(512) NOT NULL,
    duration INT
);

CREATE TABLE Playlist_has_track (
	track_id INT NOT NULL, --id_track to  track_id
    playlist_id INT NOT NULL, --id_playlist to  playlist_id
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	foreign key (id_track) REFERENCES Track(track_id),
    foreign key (id_playlist) REFERENCES Playlist(playlist_id)
);

CREATE TABLE Inbox (
	origin_user_id INT NOT NULL,
    destination_user_id INT NOT NULL,
    date_sent TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    playlist_id INT,
    track_id INT,
	foreign key (origin_user_id) REFERENCES User(user_id),
	foreign key (destination_user_id) REFERENCES User(user_id),
	foreign key (playlist_id) REFERENCES Playlist(playlist_id),
	foreign key (track_id) REFERENCES Track(track_id)
);





    
