const fs = require("fs").promises;
const path = require("path");
const { Car } = require("./models/Car");

async function init() {
  try {
    const fileData = await fs.readFile(
      path.resolve(__dirname, "../data/cars_data.csv"),
      { encoding: "utf-8" }
    );

    const seedData = fileData.split("\n");

    // remove headers
    seedData.shift();

    console.log("seed initial data. . .");
    for (const data of seedData) {
      const [id, vin, model, make, color, state] = data.split(",");
      await Car.create({ vin, model, make, color, state }).catch((err) => {
        if (err.name !== "SequelizeUniqueConstraintError") throw err; // ignore the repeated information
      });
    }
    console.log("seed complete . . .");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  init,
};
