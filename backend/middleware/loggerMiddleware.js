const winston = require('winston');

// Создаем логгер
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Middleware для логирования запросов
exports.requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            type: 'REQUEST',
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            user: req.user ? req.user.id : 'anonymous'
        });
    });
    
    next();
};

// Middleware для логирования ошибок
exports.errorLogger = (err, req, res, next) => {
    logger.error({
        type: 'ERROR',
        method: req.method,
        url: req.originalUrl,
        status: err.status || 500,
        message: err.message,
        stack: err.stack,
        ip: req.ip,
        user: req.user ? req.user.id : 'anonymous'
    });
    
    // Форматирование ошибки для клиента
    const status = err.status || 500;
    const response = {
        error: {
            message: status === 500 ? 'Internal Server Error' : err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    };
    
    res.status(status).json(response);
};