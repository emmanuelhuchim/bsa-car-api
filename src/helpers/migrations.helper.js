const path = require("path");
const { Client } = require("pg");
const { Umzug, SequelizeStorage } = require("umzug");
const sequelize = require("../database");

require("dotenv").config();

const umzug = new Umzug({
  migrations: { glob: path.resolve(__dirname, "../migrations/*.migration.js") },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const checkAndMigrate = async () => await umzug.up();

const createTestDB = async () => {
  const connection = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.connect();

  try {
    await connection.query(
      `DROP DATABASE IF EXISTS "${process.env.TEST_DB_NAME}"`
    );
    await connection.query(`CREATE DATABASE "${process.env.TEST_DB_NAME}"`);
  } catch (err) {
    if (err) throw err;
  }

  await connection.end();
};

const createDB = async () => {
  const connection = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.connect();

  try {
    await connection.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
    console.log("DB created");
  } catch (err) {
    if (err.code !== "42P04") throw err; // ignore the already created error
  }

  await connection.end();
};

module.exports = { checkAndMigrate, createTestDB, createDB };
