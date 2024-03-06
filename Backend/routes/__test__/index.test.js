// const request = require("supertest");
import request from "supertest";

import app from "../../app.js";



describe("patients", () => {
  it("Returns data ", async () => {
    const res = await request(app)
      .post("/patients")
      .send({
        firstName: "Jan",
        lastName: "Mocha",
        dob: "02/03/1992",
        address: "803 Secaucus Rd",
        contact: "2012419397",
      })
      .set("Accept", "application/json") // Set Accept header to indicate JSON response expected
      .expect("Content-Type", /json/); // Expect the response to have JSON content type

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toEqual(true);
  });

  it("Returns data ", async () => {
    const res = await request(app)
      .post("/patients")
      .send({
        firstName: "Jan",
        lastName: "Mocha",
        dob: "02/03/1992",
        address: "803 Secaucus Rd",
        contact: "2012419397",
      })
      .set("Accept", "application/json") // Set Accept header to indicate JSON response expected
      .expect("Content-Type", /json/); // Expect the response to have JSON content type

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toEqual(true);
  });

  it("Returns data ", async () => {
    const res = await request(app)
      .post("/patients")
      .send({
        firstName: "Gautam",
        lastName: "Ahuja",
        dob: "10/13/1998",
        address: "803 Secaucus Rd",
        contact: "2012419397",
      })
      .set("Accept", "application/json") // Set Accept header to indicate JSON response expected
      .expect("Content-Type", /json/); // Expect the response to have JSON content type

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toEqual(true);
  });

  it("Returns data ", async () => {
    const res = await request(app)
      .post("/patients")
      .send({
        firstName: "Shoaib",
        lastName: "Kalawant",
        dob: "12/07/1998",
        address: "803 Secaucus Rd",
        contact: "2012415858",
      })
      .set("Accept", "application/json") // Set Accept header to indicate JSON response expected
      .expect("Content-Type", /json/); // Expect the response to have JSON content type

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toEqual(true);
  });

  it("returns bad request if first name is missing", async () => {
    const res = await request(app).post("/patients").send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  it("returns bad request if first name is missing", async () => {
    const res = await request(app).post("/patients").send({firstName: "someName",
  lastName: "someLastName",
dob: "02/29/2023"});

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
  });

  it("returns bad request if first name is missing", async () => {
    const res = await request(app).post("/patients").send({firstName: "someName"});

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toEqual(false);
  });
});
