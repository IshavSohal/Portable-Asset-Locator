import { Request, Response, Router } from "express";
import { AuthenticationController } from "../Controllers/AuthenticationController";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { body } from "express-validator";
import AuthConflictError from "../Errors/AuthConflictError";
const { validationResult } = require("express-validator");

export const authenticationRoutes = Router();
const authenticationController = new AuthenticationController();

/**
 * JSON Validation
 * email: must be valid and in the ec.gc.ca domain
 * password: must be 8 characters with an uppercase character, and number
 */
authenticationRoutes.route("/register").post(
  [
    body("email")
      .exists()
      .matches(/^[A-Za-z0-9._%+-]+@ec\.gc\.ca$/)
      .isEmail()
      .isLength({ max: 50 }),
    body("password")
      .exists()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!?@#$%^&*()]{8,}$/),
    body("firstName").exists().isLength({ min: 1, max: 50 }),
    body("lastName").exists().isLength({ min: 1, max: 50 }),
  ],
  async (req: Request, res: Response) => {
    ConsoleLogger.logInfo("Registration Attempt");
    const errors = validationResult(req);
    // If JSON validation fails, send a 400, Conflict
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email as string;
    let password = req.body.password as string;
    let firstName = req.body.firstName as string;
    let lastName = req.body.lastName as string;

    try {
      const createdUser = await authenticationController.Register(
        email,
        password,
        firstName,
        lastName
      );
      // req.session.user = {id: createdUser.UID, email: createdUser.email};
      res.sendStatus(201);
    } catch (error) {
      if (error instanceof AuthConflictError) {
        res.sendStatus(error.code);
      } else {
        res.sendStatus(503);
      }
    }
  }
);

authenticationRoutes.route("/login").post(
  [
    body("email")
      .exists()
      .matches(/^[A-Za-z0-9._%+-]+@ec\.gc\.ca$/)
      .isEmail()
      .isLength({ max: 50 }),
  ],
  async (req: Request, res: Response) => {
    ConsoleLogger.logInfo("Login Attempt");
    const errors = validationResult(req);
    // If JSON validation fails, send a 400, Conflict
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let email = req.body.email as string;
    let password = req.body.password as string;
    try {
      const foundUser = await authenticationController.Authenticate(
        email,
        password
      );
      if (foundUser != null) {
        const { firstName, lastName, roleName } = foundUser;
        req.session.user = {
          id: foundUser.UID,
          email: foundUser.email,
          firstName,
          lastName,
          role: roleName,
        };
        res.status(200).send(req.session.user);
      } else {
        res.sendStatus(503);
      }
    } catch (error) {
      if (error instanceof AuthConflictError) {
        res.sendStatus(error.code);
      } else {
        res.sendStatus(503);
      }
    }
  }
);

authenticationRoutes.route("/profile").get((req: Request, res: Response) => {
  if (req.session.user) {
    res.status(200).send(req.session.user);
  } else {
    res.sendStatus(401);
  }
});

authenticationRoutes.route("/logout").get((req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      ConsoleLogger.logWarning(err);
      res.status(500).send("Error logging out");
    } else {
      ConsoleLogger.logInfo("Logout Successful");
      res.sendStatus(200);
    }
  });
});

module.exports = authenticationRoutes;
