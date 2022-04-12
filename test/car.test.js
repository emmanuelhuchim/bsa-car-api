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

      response.should.have.status(200);
      response.body.message.should.be.eq("Ok");
      response.body.data.should.be.a("array");
      response.body.data.length.should.be.eq(1000);
    });
  });

  describe("GET /cars/{id}", () => {
    it("Should GET one car by id", async () => {
      const car = await Car.findOne();
      const response = await chai.request(serverUri).get(`/cars/${car.id}`);

      response.should.have.status(200);
      response.body.message.should.be.eq("Ok");
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

      response.should.have.status(404);
      response.body.message.should.be.eq("car not found");
    });

    it("Should fail the search", async () => {
      const response = await chai.request(serverUri).get(`/cars/${undefined}`);

      response.should.have.status(500);
      response.body.message.should.be.eq("Internal server error");
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

      response.should.have.status(201);
      response.body.message.should.be.eq("Created");
      response.body.data.should.be.a("object");
      response.body.data.vin.should.be.eq(payload.vin);
      response.body.data.model.should.be.eq(payload.model);
      response.body.data.make.should.be.eq(payload.make);
      response.body.data.color.should.be.eq(payload.color);
      response.body.data.state.should.be.eq(payload.state);
    });
  });

  // GET /cars/{id}
  // POST /cars
  // PUT /cars/{id}
  // DELETE /cars/{id}
});
