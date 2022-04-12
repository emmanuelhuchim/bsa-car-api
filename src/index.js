const app = require("./app");
const seed = require("./seed");
const { checkAndMigrate, createDB } = require("./helpers/migrations.helper");

async function start() {
  await createDB();
  await checkAndMigrate();
  await seed.init();
  await app.init();
}

start();
