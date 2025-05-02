CREATE TABLE pieces
(
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    catalog_number VARCHAR(255) NOT NULL,
    composer_id    INT          NOT NULL,
    FOREIGN KEY (composer_id) REFERENCES composers (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_piece_name ON pieces (name);
CREATE INDEX idx_piece_composer ON pieces (composer);