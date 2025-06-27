const sequelize = require('../config/bd');

const models = {
  //User: require('./user.model')(sequelize),
  //тут модели в таком формате ^
};

// Установка связей
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};