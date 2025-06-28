const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8000',
  allowedHeaders: ['Content-Type', 'Authorization', 'bypass-tunnel-reminder'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


// Подключение синхронизации
require('./services/bitrixSync');


// Подключение основных маршрутов
const RouterController = require('./routes');
new RouterController(app);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

module.exports = app;