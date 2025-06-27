const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

const moveExpiredEventsToHistory = require('./services/cron/History');

//Middleware(Промежуточные обработчики)
const corsOptions = {
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization', 'bypass-tunnel-reminder'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//Подключение маршрутов
const RouterController = require('./routes');
new RouterController(app);

//Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Что-то пошло не так!' });
});

module.exports = app;