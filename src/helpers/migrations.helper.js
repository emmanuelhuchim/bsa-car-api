const path = require("path");
const { Umzug, SequelizeStorage } = require("umzug");
const sequelize = require("../database");

const umzug = new Umzug({
  migrations: { glob: path.resolve(__dirname, "../migrations/*.migration.js") },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const checkAndMigrate = async () => await umzug.up();

module.exports = { checkAndMigrate };
