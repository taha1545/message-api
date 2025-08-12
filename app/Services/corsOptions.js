require('dotenv').config();

function getCorsOptions() {
    const allowedOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
        : [];

    return {
        origin: (origin, callback) => {
            if (allowedOrigins.length === 0 || allowedOrigins.includes('*')) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(new Error(`CORS policy does not allow access from ${origin}`));
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    };
}

module.exports = getCorsOptions;
