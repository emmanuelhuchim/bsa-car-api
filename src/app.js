const Hapi = require("@hapi/hapi");
const carRoutes = require("./routes/car.routes");

require("dotenv").config();

const init = async () => {
  const server = new Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
  });

  // Routes
  carRoutes(server);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

module.exports = {
  init,
};
