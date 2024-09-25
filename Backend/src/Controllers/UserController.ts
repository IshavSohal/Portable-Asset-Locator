import { Response } from "express";
import { UserService } from "../Services/userService";
import { ConsoleLogger } from "../Logging/ConsoleLogger";

const userService = new UserService();

export class UserController { 
    public async getUsers(res: Response) {
        ConsoleLogger.logInfo("Getting all users")
        let users = await userService.getAllUsers()
        return res.status(200).json(users);
    }
}