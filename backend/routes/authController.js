require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bitrixService = require('../services/bitrixService');
const { User } = require('../models');

module.exports = {
  // Регистрация
  register: async (req, res) => {
    try {
      const { email, password, name, phone, verified } = req.body;

      // 1. Проверка существования пользователя
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ message: 'Email уже используется' });
      }

      // 2. Хеширование пароля
      const hashedPassword = await bcrypt.hash(password, 12);

      // 3. Создание пользователя
      const user = await User.create({
        email,
        password: hashedPassword,
        full_name: name,
        phone,
        verified,
        bitrix_contact_id: null // Можно добавить привязку к Bitrix
      });

      // 4. Генерация токена
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, bitrix_contact_id: bitrix_contact_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Ошибка регистрации' });
    }
  },

  // Вход
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Поиск пользователя
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Неверные учетные данные' });
      }

      // 2. Проверка пароля
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Неверные учетные данные' });
      }

      // 3. Генерация токена
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, bitrix_contact_id: user.bitrix_contact_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Ошибка входа' });
    }
  },

  // Выход (на клиенте просто удаляем токен)
  logout: (req, res) => {
    res.json({ message: 'Выход выполнен успешно' });
  },

  // Получение текущего пользователя
  getMe: async (req, res) => {
    try {
      const bitrixContact = await bitrixService.getContactList({ 'ID': req.user.bitrix_contact_id }, ['ID', 'NAME', 'LAST_NAME', 'EMAIL', 'PHONE', 'TYPE_ID', 'SOURCE_ID'], 0);

      const formatBitrixData = (contact) => {
        return {
          id: contact.ID,
          name: contact.NAME,
          lastName: contact.LAST_NAME,
          email: contact.EMAIL?.[0]?.VALUE || null,
          phone: contact.PHONE?.[0]?.VALUE || null,
          role: contact.TYPE_ID,
          sourceId: contact.SOURCE_ID,
          bitrixData: contact // Все данные из Bitrix (опционально)
        };
      };

      res.json(formatBitrixData(bitrixContact.result) || 'пусто');
    } catch (err) {
      console.error('Get me error:', err);
      res.status(500).json({ message: 'Ошибка получения данных' });
    }
  }
};