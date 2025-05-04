CREATE TABLE composers
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE INDEX idx_composer_name ON composers (name);
