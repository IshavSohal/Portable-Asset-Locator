import request from "supertest";
import app from "../../src/index";
import { UserService } from "../../src/Services/userService"

const userService = new UserService();

describe("Sign-in endpoint tests", () => {
     beforeAll(async () => {
        // register a new user
        await request(app).post("/api/auth/register").send({
            "email": "newUser123@ec.gc.ca",
            "password": "myPassWord123",
            "firstName": "Name1",
            "lastName": "Name2"
         });         
      });

      afterAll(async () => {
        const newUser = await userService.getUserByEmail("newUser123@ec.gc.ca");
        if(newUser) await userService.deleteUser(newUser.UID);
        
      });

    it("Successful login", async () => {
      const res = await request(app).post("/api/auth/login").send({
        "email": "newUser123@ec.gc.ca",
        "password": "myPassWord123"
      });
      expect(res.statusCode).toEqual(200);

    });

    it("Correct email, incorrect password", async () => {
        const res = await request(app).post("/api/auth/login").send({
            "email": "newUser123@ec.gc.ca",
            "password": "myPassord123"
          });
        expect(res.statusCode).toEqual(401);

    });


    it("Incorrect email, correct password", async () => {
        const res = await request(app).post("/api/auth/login").send({
            "email": "newser@ec.gc.ca",
            "password": "myPassWord123"
          });
        expect(res.statusCode).toEqual(401);

    });

    it("No email provided", async () => {
        const res = await request(app).post("/api/auth/login").send({
            "email": "",
            "password": "myPassWord123"
          });
        expect(res.statusCode).toEqual(400);

    });

    it("No password provided", async () => {
        const res = await request(app).post("/api/auth/login").send({
            "email": "newUser123@ec.gc.ca",
            "password": ""
          });
        expect(res.statusCode).toEqual(401);

    });
  });