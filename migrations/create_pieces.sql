CREATE TABLE pieces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    catalog_number VARCHAR(255) NOT NULL,
    composer VARCHAR(255) NOT NULL
);

CREATE INDEX idx_piece_name ON pieces (name);
CREATE INDEX idx_piece_composer ON pieces (composer);