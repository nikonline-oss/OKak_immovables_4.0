const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Предполагается модель User

module.exports = {
  // Проверка JWT и добавление пользователя в запрос
  authenticate: async (req, res, next) => {
    try {
      // 1. Получаем токен из заголовков
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }

      // 2. Верифицируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. Находим пользователя в БД
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'Пользователь не найден' });
      }

      // 4. Добавляем пользователя в запрос
      req.user = user;
      next();
    } catch (err) {
      console.error('JWT Error:', err);
      return res.status(401).json({ 
        message: 'Недействительный токен',
        error: err.message 
      });
    }
  },

  // Дополнительно: проверка ролей
  authorize: (roles = []) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Доступ запрещен' });
      }
      next();
    };
  }
};