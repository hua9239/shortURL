CREATE TABLE IF NOT EXISTS urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shortCode VARCHAR(10) NOT NULL UNIQUE,
    fullUrl VARCHAR(2048) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shortCode ON urls (shortCode);


INSERT INTO urls (shortCode, fullUrl, createdAt) VALUES 
('abc123', 'https://www.example.com/', '2024-01-01 12:00:00'),
('xyz789', 'https://www.google.com/', '2024-01-02 13:30:00');
