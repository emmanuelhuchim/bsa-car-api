const Sequelize = require("sequelize");
require("dotenv").config();

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: 3,
      min: 0,
    },
    define: {
      freezeTableName: true,
      timestamps: false,
    },
    logging: false,
  }
);
