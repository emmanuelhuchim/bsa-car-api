const { Sequelize } = require("sequelize");

async function up({ context: queryInterface }) {
  await queryInterface.createTable("car", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
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
}

async function down(queryInterface) {
  await queryInterface.dropTable("car");
}

module.exports = { up, down };
