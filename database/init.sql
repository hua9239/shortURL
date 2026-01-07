CREATE TABLE IF NOT EXISTS urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shortCode VARCHAR(10) NOT NULL UNIQUE,
    fullUrl VARCHAR(2048) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shortCode ON urls (shortCode);


INSERT INTO urls (shortCode, fullUrl, createdAt) VALUES 
('code1', 'https://www.example.com/', '2000-01-01 00:00:00'),
('code2', 'https://www.google.com/', '2000-01-02 00:00:00');
