const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = {
  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      return await User.create({
        tag_name: userData.tag_name,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        privilege: userData.privilege || 'user',
        city: userData.city
      });
    } catch (error) {
      throw new Error(`Ошибка при создании пользователя: ${error.message}`);
    }
  },

  async findUserByTag(tag_name) {
    try {
      return await User.findOne({ 
        where: { tag_name },
        attributes: ['id', 'tag_name', 'name', 'email', 'password', 'privilege', 'city']
      });
    } catch (error) {
      throw new Error(`Ошибка при поиске пользователя: ${error.message}`);
    }
  },

  async findUserByEmail(email) {
    try {
      return await User.findOne({ 
        where: { email },
        attributes: ['id', 'tag_name', 'email']
      });
    } catch (error) {
      throw new Error(`Ошибка при поиске пользователя: ${error.message}`);
    }
  },

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  },

  async updateUserRefreshToken(userId, refreshToken) {
    try {
      return await User.update(
        { refresh_token: refreshToken },
        { where: { id: userId } }
      );
    } catch (error) {
      throw new Error(`Ошибка при обновлении токена: ${error.message}`);
    }
  },

  async findUserById(id) {
    try {
      return await User.findByPk(id, {
        attributes: ['id', 'tag_name', 'name', 'email', 'privilege', 'city']
      });
    } catch (error) {
      throw new Error(`Ошибка при поиске пользователя: ${error.message}`);
    }
  }
};