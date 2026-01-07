module.exports = {
    port: process.env.PORT || 3000,
    blockedDomains: ["localhost", "127.0.0.1", "0.0.0.0", "::1"],
    blockedCodes: ["api", "manage", "login"],
    db: {
        host: process.env.DB_HOST || "mysql",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "shorturl_db",
    },
    jwtSecret: process.env.JWT_SECRET || "jwt_secret_key",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    adminUser: process.env.ADMIN_USER || "admin",
    adminPassword: process.env.ADMIN_PASSWORD || "password"
};
