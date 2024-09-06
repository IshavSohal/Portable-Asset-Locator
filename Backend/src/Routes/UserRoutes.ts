import { Request, Response, Router } from "express";
import { UserController } from "../Controllers/UserController";
var authMiddleware = require("../Middleware/AuthMiddleware");

const userRoutes = Router();
const userController = new UserController;

userRoutes.get(
    "/", 
    authMiddleware.isAuthenticated,
    async (req: Request, res: Response) => {
        return await userController.getUsers(res);
    }
);

module.exports = userRoutes;

