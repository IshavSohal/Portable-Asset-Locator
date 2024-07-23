import request from "supertest";
import app from "../../src/index";

describe("Server setup tests", () => {
  it("Root test", async () => {
    const res = await request(app).get("/api");
    expect(res.statusCode).toEqual(302);
  });
});