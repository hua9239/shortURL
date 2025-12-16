CREATE TABLE IF NOT EXISTS urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    short_url_code VARCHAR(10) NOT NULL UNIQUE,
    full_url VARCHAR(2048) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO urls (short_url_code, full_url, created_at) VALUES 
('abc123', 'https://www.example.com/', '2024-01-01 12:00:00'),
('xyz789', 'https://www.google.com/', '2024-01-02 13:30:00');
