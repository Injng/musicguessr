CREATE TABLE recordings (
    id SERIAL PRIMARY KEY,
    piece_id INT NOT NULL,
    artist_id INT NOT NULL,
    FOREIGN KEY (piece_id) REFERENCES pieces(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_recording_piece ON recordings (piece_id);
CREATE INDEX idx_recording_artist ON recordings (artist_id);