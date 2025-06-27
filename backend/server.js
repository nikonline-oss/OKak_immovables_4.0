const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

require('./models');

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
const sequelize = require('./config/bd');

const PORT = process.env.PORT || 8080;

// // Важное изменение для доступа извне
// server.listen(PORT, '0.0.0.0', () => {  // Добавлен хост 0.0.0.0
//     console.log(`Сервер запущен на порту ${PORT}`);
//     console.log(`Доступ через: http://176.59.83.69:${PORT}`);
// });

// 2. Проверка подключения перед синхронизацией
async function initialize() {
  try {
    await sequelize.authenticate();
    console.log('✅ Подключение к БД успешно');
    
    // 3. Безопасная синхронизация
    await sequelize.sync({ force: true });
    console.log('🔄 Модели синхронизированы');
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`🔗 Доступ через: http://176.59.83.69:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Ошибка инициализации:', err);
    process.exit(1); // Завершение процесса при ошибке
  }
}

initialize();