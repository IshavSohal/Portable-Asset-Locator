import request from "supertest";
import app from "../../src/index";

describe("Hello World endpoint tests", () => {
  it("GET endpoint", async () => {
    const res = await request(app).get("/api/HelloWorld/start");
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual("Hello World");
  });
});
