module.exports = {
    port: process.env.PORT || 3000,
    blockedDomains: ['127.0.0.1', 'localhost', '0.0.0.0', '::1'],
    blockedCodes: [
        'api', 'login', 'logout', 'register', 'admin', 'dashboard', 
        'health', 'metrics', 'static', 'assets', 'public', 
        'favicon.ico', 'robots.txt', 'sitemap.xml'
    ],
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'p@ssword',
        database: process.env.DB_NAME || 'shorturl_db',
    },
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    jwtExpiresIn: '1d',
    adminUser: process.env.ADMIN_USER || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'password'
};
