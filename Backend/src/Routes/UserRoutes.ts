import { Request, Response, Router } from "express";
import { UserController } from "../Controllers/UserController";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { validationResult } from "express-validator";
var authMiddleware = require("../Middleware/AuthMiddleware");

const userRoutes = Router();
const userController = new UserController();

userRoutes.get(
  "/",
  authMiddleware.isAuthenticated,
  async (req: Request, res: Response) => {
    return await userController.getUsers(res);
  }
);

// Get user data from ID
userRoutes.get(
  "/:userID",
  authMiddleware.isAuthenticated,
  async (req: Request, res: Response) => {
    ConsoleLogger.logInfo(`Get user info attempt: ${req.params.userID}`);
    const errors = validationResult(req);

    // If JSON validation fails, send a 400, Conflict
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userID = parseInt(req.params.userID);

    return await userController.getUserById(userID, res);
  }
);

module.exports = userRoutes;
