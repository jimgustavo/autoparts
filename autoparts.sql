CREATE TABLE autoparts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    make VARCHAR(255),
    models VARCHAR(255),
    description TEXT,
    purchase_price NUMERIC,
    sale_price NUMERIC,
    photo VARCHAR(255),
    stock INT
);
