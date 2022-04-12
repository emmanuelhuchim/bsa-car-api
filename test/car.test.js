require("dotenv").config();

// Force test database
process.env.DB_NAME = process.env.TEST_DB_NAME;

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app");
const seed = require("../src/seed");
const {
  checkAndMigrate,
  createTestDB,
} = require("../src/helpers/migrations.helper");
const { Car } = require("../src/models/Car");
const { HTTP_RESPONSES } = require("../src/utils/controller.utils");

const serverUri = `http://${process.env.HOST || "localhost"}:${
  process.env.PORT || 3000
}`;

chai.should();
chai.use(chaiHttp);

describe("Test car API", () => {
  before(async function () {
    this.timeout(200000);
    try {
      await createTestDB();
      await checkAndMigrate();
      await seed.init();
      await app.init();
    } catch (err) {
      console.error(err);
      throw err;
    }
  });

  describe("GET /cars", () => {
    it("Should GET all the cars", async () => {
      const response = await chai.request(serverUri).get("/cars");

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.message.should.be.eq(HTTP_RESPONSES.ok.message);
      response.body.data.should.be.a("array");
      response.body.data.length.should.be.eq(1000);
    });
  });

  describe("GET /cars/{id}", () => {
    it("Should GET one car by id", async () => {
      const car = await Car.findOne();
      const response = await chai.request(serverUri).get(`/cars/${car.id}`);

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.message.should.be.eq(HTTP_RESPONSES.ok.message);
      response.body.data.should.be.a("object");
      response.body.data.id.should.be.eq(car.id);
      response.body.data.vin.should.be.eq(car.vin);
      response.body.data.model.should.be.eq(car.model);
      response.body.data.make.should.be.eq(car.make);
      response.body.data.color.should.be.eq(car.color);
      response.body.data.state.should.be.eq(car.state);
    });

    it("Should not find a car", async () => {
      const response = await chai.request(serverUri).get(`/cars/${0}`);

      response.should.have.status(HTTP_RESPONSES.notFound.code);
      response.body.message.should.be.eq(HTTP_RESPONSES.notFound.message);
    });

    it("Should fail the search", async () => {
      const response = await chai.request(serverUri).get(`/cars/${undefined}`);

      response.should.have.status(HTTP_RESPONSES.serverError.code);
      response.body.message.should.be.eq(HTTP_RESPONSES.serverError.message);
    });
  });

  describe("POST /cars", () => {
    it("Should CREATE a new car record", async () => {
      const payload = {
        vin: "1NXBE4EE5AZ031111",
        model: 2010,
        make: "Ford",
        color: "Orange",
        state: "Georgia",
      };

      const response = await chai
        .request(serverUri)
        .post("/cars")
        .send(payload);

      response.should.have.status(HTTP_RESPONSES.created.code);
      response.body.message.should.be.eq(HTTP_RESPONSES.created.message);
      response.body.data.should.be.a("object");
      response.body.data.vin.should.be.eq(payload.vin);
      response.body.data.model.should.be.eq(payload.model);
      response.body.data.make.should.be.eq(payload.make);
      response.body.data.color.should.be.eq(payload.color);
      response.body.data.state.should.be.eq(payload.state);
    });

    it("Should fail the new record creation", async () => {
      const payload = {
        vin: "1NXBE4EE5AZ031111",
        model: 2010,
        make: "Ford",
        color: "Orange",
        state: "Georgia",
      };

      const response = await chai
        .request(serverUri)
        .post("/cars")
        .send(payload);

      response.should.have.status(HTTP_RESPONSES.serverError.code);
      response.body.message.should.be.eq(HTTP_RESPONSES.serverError.message);
    });

    it("Should fail the new record creation because no vin", async () => {
      const payload = {
        model: 2010,
        make: "Ford",
        color: "Orange",
        state: "Georgia",
      };

      const response = await chai
        .request(serverUri)
        .post("/cars")
        .send(payload);

      response.should.have.status(400);
      response.body.message.should.be.eq(`\"vin\" is required`);
    });
    it("Should fail the new record creation because no model", async () => {
      const payload = {
        vin: "1NXBE4EE5AZ031111",
        make: "Ford",
        color: "Orange",
        state: "Georgia",
      };

      const response = await chai
        .request(serverUri)
        .post("/cars")
        .send(payload);

      response.should.have.status(400);
      response.body.message.should.be.eq(`\"model\" is required`);
    });
    it("Should fail the new record creation because no make", async () => {
      const payload = {
        vin: "1NXBE4EE5AZ031111",
        model: 2010,
        color: "Orange",
        state: "Georgia",
      };

      const response = await chai
        .request(serverUri)
        .post("/cars")
        .send(payload);

      response.should.have.status(400);
      response.body.message.should.be.eq(`\"make\" is required`);
    });
    it("Should fail the new record creation because no color", async () => {
      const payload = {
        vin: "1NXBE4EE5AZ031111",
        model: 2010,
        make: "Ford",
        state: "Georgia",
      };

      const response = await chai
        .request(serverUri)
        .post("/cars")
        .send(payload);

      response.should.have.status(400);
      response.body.message.should.be.eq(`\"color\" is required`);
    });
    it("Should fail the new record creation because no state", async () => {
      const payload = {
        vin: "1NXBE4EE5AZ031111",
        model: 2010,
        make: "Ford",
        color: "Orange",
      };

      const response = await chai
        .request(serverUri)
        .post("/cars")
        .send(payload);

      response.should.have.status(400);
      response.body.message.should.be.eq(`\"state\" is required`);
    });
  });

  describe("PUT /cars", () => {
    it("Should update one car with new color", async () => {
      const payload = {
        color: "black",
      };
      const car = await Car.findOne();
      const response = await chai
        .request(serverUri)
        .put(`/cars/${car.id}`)
        .send(payload);

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.message.should.be.eq("Updated");
      response.body.data.should.be.a("object");
      response.body.data.color.should.be.eq(payload.color);
    });
    it("Should update one car with all properties", async () => {
      const car = await Car.findOne();
      const payload = {
        vin: car.vin,
        model: car.model,
        make: car.make,
        color: car.color,
        state: car.state,
      };
      const response = await chai
        .request(serverUri)
        .put(`/cars/${car.id}`)
        .send(payload);

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.message.should.be.eq("Updated");
      response.body.data.should.be.a("object");
      response.body.data.vin.should.be.eq(payload.vin);
      response.body.data.model.should.be.eq(payload.model);
      response.body.data.make.should.be.eq(payload.make);
      response.body.data.color.should.be.eq(payload.color);
      response.body.data.state.should.be.eq(payload.state);
    });
    it("Should fail update because same vin", async () => {
      const cars = await Car.findAll({ limit: 2 });
      const payload = {
        vin: cars[0].vin,
      };

      const response = await chai
        .request(serverUri)
        .put(`/cars/${cars[1].id}`)
        .send(payload);

      response.should.have.status(HTTP_RESPONSES.serverError.code);
      response.body.message.should.be.eq(HTTP_RESPONSES.serverError.message);
    });
    it("Should not find a car", async () => {
      const payload = {
        color: "Black",
      };
      const response = await chai
        .request(serverUri)
        .put(`/cars/${0}`)
        .send(payload);

      response.should.have.status(HTTP_RESPONSES.notFound.code);
      response.body.message.should.be.eq(HTTP_RESPONSES.notFound.message);
    });
    it("Should fail because no payload", async () => {
      const car = await Car.findOne();
      const response = await chai.request(serverUri).put(`/cars/${car.id}`);

      response.should.have.status(400);
    });
  });

  describe("DELETE /cars", () => {
    it("Should delete one car", async () => {
      const car = await Car.findOne();
      const response = await chai.request(serverUri).delete(`/cars/${car.id}`);

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.message.should.be.eq("Deleted");
    });
    it("Should not find a car", async () => {
      const response = await chai.request(serverUri).delete(`/cars/${0}`);

      response.should.have.status(HTTP_RESPONSES.notFound.code);
      response.body.message.should.be.eq(HTTP_RESPONSES.notFound.message);
    });
  });

  describe("GET /cars/search", () => {
    it("Should search one car with the same vin", async () => {
      const car = await Car.findOne();
      const response = await chai
        .request(serverUri)
        .get(`/cars/search?where={"vin":"${car.vin}" }`);

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.data.should.be.a("array");
      response.body.data.length.should.be.eq(1);
      response.body.data[0].vin.should.be.eq(car.vin);
    });
    it("Should search cars with the same color", async () => {
      const cars = await Car.findAll({ where: { color: "Blue" } });
      const response = await chai
        .request(serverUri)
        .get(`/cars/search?where={"color":"${cars[0].color}" }`);

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.data.should.be.a("array");
      response.body.data.length.should.be.eq(cars.length);
    });
    it("Should search cars with the same model", async () => {
      const cars = await Car.findAll({ where: { model: 2008 } });
      const response = await chai
        .request(serverUri)
        .get(`/cars/search?where={"model":"${cars[0].model}" }`);

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.data.should.be.a("array");
      response.body.data.length.should.be.eq(cars.length);
    });
    it("Should search cars with the same make", async () => {
      const cars = await Car.findAll({ where: { make: "Dodge" } });
      const response = await chai
        .request(serverUri)
        .get(`/cars/search?where={"make":"${cars[0].make}" }`);

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.data.should.be.a("array");
      response.body.data.length.should.be.eq(cars.length);
    });
    it("Should search cars with the same state", async () => {
      const cars = await Car.findAll({ where: { state: "California" } });
      const response = await chai
        .request(serverUri)
        .get(`/cars/search?where={"state":"${cars[0].state}" }`);

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.data.should.be.a("array");
      response.body.data.length.should.be.eq(cars.length);
    });
    it("Should search cars with the same 2 properties", async () => {
      const cars = await Car.findAll({
        where: { state: "Nevada", make: "Honda" },
      });
      const response = await chai
        .request(serverUri)
        .get(
          `/cars/search?where={"state":"${cars[0].state}", "make":"${cars[0].make}" }`
        );

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.data.should.be.a("array");
      response.body.data.length.should.be.eq(cars.length);
    });
    it("Should search cars with the same 3 properties", async () => {
      const cars = await Car.findAll({
        where: { state: "Nevada", make: "Honda", model: 2005 },
      });
      const response = await chai
        .request(serverUri)
        .get(
          `/cars/search?where={"state":"${cars[0].state}", "make":"${cars[0].make}", "model":"${cars[0].model}" }`
        );

      response.should.have.status(HTTP_RESPONSES.ok.code);
      response.body.data.should.be.a("array");
      response.body.data.length.should.be.eq(cars.length);
    });
  });

  after(() => {
    setTimeout(() => process.exit(0), 2000);
  });
});
