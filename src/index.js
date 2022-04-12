const app = require("./app");
const seed = require("./seed");
const { checkAndMigrate } = require("./helpers/migrations.helper");

async function start() {
  await checkAndMigrate();
  await seed.init();
  await app.init();
}

start();
