const Sequelize = require("sequelize");
const sequelize = require("../database");

const Car = sequelize.define("car", {
  vin: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  model: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  make: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  color: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = {
  Car,
};
