const { Car } = require("../models/Car");
const { HTTP_RESPONSES } = require("../utils/controller.utils");

const carController = {};

carController.searchCars = async (request, h) => {
  try {
    const { vin, model, make, color, state } = JSON.parse(
      request.query.where || "{}"
    );

    // only car attributes specified
    const where = { vin, model, make, color, state };
    Object.keys(where).forEach((key) =>
      where[key] === undefined ? delete where[key] : {}
    );

    const cars = await Car.findAll({
      where,
    });
    return h
      .response({ message: HTTP_RESPONSES.ok.message, data: cars })
      .code(HTTP_RESPONSES.ok.code);
  } catch (error) {
    console.log(error);
    return h
      .response({ message: HTTP_RESPONSES.serverError.message })
      .code(HTTP_RESPONSES.serverError.code);
  }
};

carController.getCars = async (request, h) => {
  try {
    const cars = await Car.findAll();
    return h
      .response({ message: HTTP_RESPONSES.ok.message, data: cars })
      .code(HTTP_RESPONSES.ok.code);
  } catch (error) {
    return h
      .response({ message: HTTP_RESPONSES.serverError.message })
      .code(HTTP_RESPONSES.serverError.code);
  }
};

carController.getCar = async (request, h) => {
  try {
    const { id } = request.params;
    const car = await Car.findByPk(id);

    if (!car) {
      return h
        .response({ message: HTTP_RESPONSES.notFound.message })
        .code(HTTP_RESPONSES.notFound.code);
    }

    return h
      .response({ message: HTTP_RESPONSES.ok.message, data: car })
      .code(HTTP_RESPONSES.ok.code);
  } catch (error) {
    return h
      .response({ message: HTTP_RESPONSES.serverError.message })
      .code(HTTP_RESPONSES.serverError.code);
  }
};

carController.createCar = async (request, h) => {
  const { vin, model, make, color, state } = request.payload;
  try {
    const car = await Car.create({ vin, model, make, color, state });
    return h
      .response({ message: HTTP_RESPONSES.created.message, data: car })
      .code(HTTP_RESPONSES.created.code);
  } catch (error) {
    return h
      .response({ message: HTTP_RESPONSES.serverError.message })
      .code(HTTP_RESPONSES.serverError.code);
  }
};

carController.updateCar = async (request, h) => {
  try {
    const { id } = request.params;
    const { vin, model, make, color, state } = request.payload;

    const car = await Car.findByPk(id);
    if (!car) {
      return h
        .response({ message: HTTP_RESPONSES.notFound.message })
        .code(HTTP_RESPONSES.notFound.code);
    }

    await car.update({ vin, model, make, color, state });

    return h
      .response({ message: "Updated", data: car })
      .code(HTTP_RESPONSES.ok.code);
  } catch (error) {
    return h
      .response({ message: HTTP_RESPONSES.serverError.message })
      .code(HTTP_RESPONSES.serverError.code);
  }
};

carController.deleteCar = async (request, h) => {
  try {
    const { id } = request.params;

    const car = await Car.findByPk(id);
    if (!car) {
      return h
        .response({ message: HTTP_RESPONSES.notFound.message })
        .code(HTTP_RESPONSES.notFound.code);
    }

    await car.destroy();

    return h.response({ message: "Deleted" }).code(HTTP_RESPONSES.ok.code);
  } catch (error) {
    return h
      .response({ message: HTTP_RESPONSES.serverError.message })
      .code(HTTP_RESPONSES.serverError.code);
  }
};

module.exports = { carController };
