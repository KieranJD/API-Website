CREATE TABLE roles (
    name VARCHAR(16) UNIQUE NOT NULL,
    description TEXT,
    PRIMARY KEY (name)
);

INSERT INTO roles (name) VALUES ('user');
INSERT INTO roles (name) VALUES ('admin');