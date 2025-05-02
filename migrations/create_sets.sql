CREATE TABLE sets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL,
    description TEXT NULL
);

CREATE TABLE set_recordings (
    set_id INT NOT NULL,
    recording_id INT NOT NULL,
    FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (recording_id) REFERENCES recordings(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_set_recording_set ON set_recordings (set_id);
CREATE INDEX idx_set_recording_recording ON set_recordings (recording_id);