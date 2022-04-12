const { Car } = require("../models/Car");

const carController = {};

carController.getCars = async (request, h) => {
  try {
    const cars = await Car.findAll();
    return h.response({ message: "Ok", data: cars }).code(200);
  } catch (error) {
    return h.response({ message: "Internal server error" }).code(500);
  }
};

carController.getCar = async (request, h) => {
  try {
    const { id } = request.params;
    const car = await Car.findByPk(id);
    return h.response({ message: "Ok", data: car }).code(200);
  } catch (error) {
    return h.response({ message: "Internal server error" }).code(500);
  }
};

carController.createCar = async (request, h) => {
  const { vin, model, make, color, state } = request.payload;
  try {
    const car = await Car.create({ vin, model, make, color, state });
    return h.response({ message: "Created", data: car }).code(201);
  } catch (error) {
    return h.response({ message: "Internal server error" }).code(500);
  }
};

carController.updateCar = async (request, h) => {
  try {
    const { id } = request.params;
    const { vin, model, make, color, state } = request.payload;

    const car = await Car.findByPk(id);
    if (!car) {
      return h.response({ message: "car not found" }).code(404);
    }

    await car.update({ vin, model, make, color, state });

    return h.response({ message: "Updated", data: car }).code(200);
  } catch (error) {
    return h.response({ message: "Internal server error" }).code(500);
  }
};

carController.deleteCar = async (request, h) => {
  try {
    const { id } = request.params;

    const car = await Car.findByPk(id);
    if (!car) {
      return h.response({ message: "car not found" }).code(404);
    }

    await car.destroy();

    return h.response({ message: "Deleted" }).code(200);
  } catch (error) {
    return h.response({ message: "Internal server error" }).code(500);
  }
};

module.exports = { carController };
