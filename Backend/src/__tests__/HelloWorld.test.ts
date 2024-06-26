import request from "supertest";
import app from "../index";

describe("Hello World endpoint tests", () => {
    it("GET endpoint", async () => {
      const res = await request(app)
      .get("/start")
      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual("Hello World");
    });
  });