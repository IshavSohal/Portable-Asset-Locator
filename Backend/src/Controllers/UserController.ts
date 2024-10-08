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

    public async getUserById(userID: number, res: Response) {
        ConsoleLogger.logInfo(`Getting user with id: ${userID}`)
        let user = await userService.getUserById(userID)

        if (user === null){
            ConsoleLogger.logWarning("User not found");
            return res.sendStatus(404);
        } else{
            delete user.password;
            delete user.iv;
            return res.status(200).json(user);
        }
       
    }
}

