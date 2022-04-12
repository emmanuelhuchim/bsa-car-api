const { carController } = require("../controllers/car.controller");
const { failAction } = require("../validators/general.validator");
const {
  carCreateValidator,
  carUpdateValidator,
} = require("../validators/Car.validator");

const endpointBase = "cars";

module.exports = (server) => {
  server.route({
    method: "GET",
    path: `/${endpointBase}`,
    handler: carController.getCars,
  });

  server.route({
    method: "GET",
    path: `/${endpointBase}/{id}`,
    handler: carController.getCar,
  });

  server.route({
    method: "POST",
    path: `/${endpointBase}`,
    options: { validate: { ...carCreateValidator, failAction } },
    handler: carController.createCar,
  });

  server.route({
    method: "PUT",
    path: `/${endpointBase}/{id}`,
    options: { validate: { ...carUpdateValidator, failAction } },
    handler: carController.updateCar,
  });

  server.route({
    method: "DELETE",
    path: `/${endpointBase}/{id}`,
    handler: carController.deleteCar,
  });
};
