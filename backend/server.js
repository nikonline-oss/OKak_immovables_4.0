const app = require('./app');
const http = require('http');
const Sequelize = require('sequelize');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { User, Developer, Apartment, Booking, UserCountHistory } = require('./models');


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

    // // 3. Безопасная синхронизация
    // await sequelize.sync({ force: true });
    // console.log('🔄 Модели синхронизированы');

    // // Тестовые данные
    // const user = await User.create({
    //   full_name: 'Тестовый Пользователь',
    //   password: 'testpassword',
    //   email: 'test@example.com',
    //   phone: '+71234567890',
    //   verified: true
    // });

    // const developer = await Developer.create({
    //   name: 'СтройГард',
    //   inn: "123442323",
    //   user_id: user.id
    // });

    // const apartment = await Apartment.create({
    //   title: 'Уютная 2-комнатная квартира',
    //   description: 'Просторная квартира с ремонтом',
    //   address: 'ул. Центральная, 15',
    //   price: 5000000,
    //   region: 'Центральный',
    //   booking_status: 'available',
    //   link: '/apartments/1',
    //   developer_id: developer.id
    // });

    // // Создаем бронирование для связи пользователя с квартирой
    // await Booking.create({
    //   user_id: user.id,
    //   apartment_id: apartment.id,
    //   status: 'confirmed'
    // });

    // await UserCountHistory.create({ total_users: 1 });

    // Хуки для модели User
    // User.afterCreate(async (user) => {
    //   if (user.verified) {
    //     await updateApartmentPricesForUser(user, 'INSERT');
    //   }
    // });

    console.log('Тестовые данные созданы');


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