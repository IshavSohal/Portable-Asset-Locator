import request from "supertest";
import app from "../../src/index";
import { UserService } from "../../src/Services/userService";

const apiAddress = "/api/auth/register";
const unusedValidEmail = "joe@ec.gc.ca";
const alreadyUsedValidEmail = "test@ec.gc.ca";

describe("Registration endpoint tests", () => {
  /* MISSING PARAMETER TESTS */

  it("missing everything returns 400", async () => {
    const res = await request(app).post(apiAddress);
    expect(res.statusCode).toEqual(400);
  });

  it("missing email returns 400", async () => {
    const res = await request(app)
      .post(apiAddress)
      .send({ password: "Abcdefg#3", firstName: "Joe", lastName: "Mama" });
    expect(res.statusCode).toEqual(400);
  });

  it("missing password returns 400", async () => {
    const res = await request(app)
      .post(apiAddress)
      .send({ email: unusedValidEmail, firstName: "Joe", lastName: "Mama" });
    expect(res.statusCode).toEqual(400);
  });

  it("missing firstName returns 400", async () => {
    const res = await request(app)
      .post(apiAddress)
      .send({
        email: unusedValidEmail,
        password: "Abcdefg#3",
        lastName: "Mama",
      });
    expect(res.statusCode).toEqual(400);
  });

  it("missing lastName returns 400", async () => {
    const res = await request(app)
      .post(apiAddress)
      .send({
        email: unusedValidEmail,
        password: "Abcdefg#3",
        firstName: "Joe",
      });
    expect(res.statusCode).toEqual(400);
  });

  /* BAD EMAIL TESTS */

  it("non-@ec.gc.ca email returns 400", async () => {
    const res = await request(app).post(apiAddress).send({
      email: "joe@evilimposter.ca",
      password: "Abcdefg#3",
      firstName: "Joe",
      lastName: "Joe",
    });
    expect(res.statusCode).toEqual(400);
  });

  it("email already registered returns 409", async () => {
    const res = await request(app).post(apiAddress).send({
      email: alreadyUsedValidEmail,
      password: "Abcdefg#3",
      firstName: "Joe",
      lastName: "Joe",
    });
    expect(res.statusCode).toEqual(409);
  });

  /* BAD PASSWORD TESTS */

  it("password < 8 chars returns 400", async () => {
    const res = await request(app).post(apiAddress).send({
      email: unusedValidEmail,
      password: "Abcde#3",
      firstName: "Joe",
      lastName: "Joe",
    });
    expect(res.statusCode).toEqual(400);
  });

  it("password with no capital letter returns 400", async () => {
    const res = await request(app).post(apiAddress).send({
      email: unusedValidEmail,
      password: "abcdefg#3",
      firstName: "Joe",
      lastName: "Joe",
    });
    expect(res.statusCode).toEqual(400);
  });

  it("password with no number returns 400", async () => {
    const res = await request(app).post(apiAddress).send({
      email: unusedValidEmail,
      password: "Abcdefg#",
      firstName: "Joe",
      lastName: "Joe",
    });
    expect(res.statusCode).toEqual(400);
  });

  it("password with illegal special character returns 400", async () => {
    const res = await request(app).post(apiAddress).send({
      email: unusedValidEmail,
      password: "Abcdefg/.",
      firstName: "Joe",
      lastName: "Joe",
    });
    expect(res.statusCode).toEqual(400);
  });

  /* SUCCESSFUL REGISTER TESTS */

  it("successful registration returns 201", async () => {
    const res = await request(app).post(apiAddress).send({
      email: unusedValidEmail,
      password: "Abcdefg#3",
      firstName: "Joe",
      lastName: "Joe",
    });
    expect(res.statusCode).toEqual(201);

    // Check if new email is now registered
    const recheck = await request(app).post(apiAddress).send({
      email: unusedValidEmail,
      password: "Abcdefg#1",
      firstName: "Joetwo",
      lastName: "Joetwo",
    });
    expect(recheck.statusCode).toEqual(409);

    // Delete the successfully added user, so we can automatically rerun this test
    // without needing to manually delete this user every time
    const userService = new UserService();
    const user = await userService.getUserByEmail(unusedValidEmail);
    if (user?.UID) {
      const deleted = await userService.deleteUser(user.UID);
      expect(deleted.email).toEqual(unusedValidEmail);
      console.debug(deleted); // Also useful for checking if password was hashed
    }
  });
});
