const dotenv = require('dotenv');
dotenv.config();

const requiredEnv = [
    "PORT",
    "JWT_SECRET",
    "DATABASE_URL",
    "REDIS_URL"
];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Error: Missing required environment variable ${key}`);
        process.exit(1);
    }
});

const env = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
    },
    nodeEnv: process.env.NODE_ENV || 'development',
}

module.exports = env;