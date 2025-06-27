const { Sequelize } = require('sequelize');
require('dotenv').config(); 

/*const sequelize = new Sequelize(
    'web_applications',
    'root',
    '130_Sql_82!',
    {
        host: 'localhost',
        dialect: 'mysql',
    }
);*/
// const sequelize = new Sequelize({
//     dialect: 'post',
//     host: 'localhost',
//     username: 'root',
//     password: '130_Sql_82!',
//     database: 'testbd',
//     define: {
//       timestamps: true,
//     }
//   });
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
const sequelize = new Sequelize({
  dialect: 'postgres',
  username: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD), // Явное преобразование
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});

module.exports = sequelize;