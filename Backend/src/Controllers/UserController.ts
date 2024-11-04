import { Response } from "express";
import { UserService } from "../Services/userService";
import { ConsoleLogger } from "../Logging/ConsoleLogger";

const userService = new UserService();

export class UserController {
  public async getUsers(res: Response) {
    ConsoleLogger.logInfo("Getting all users");
    let users = await userService.getAllUsers();
    return res.status(200).json(users);
  }

  public async getUserById(userID: number, res: Response) {
    ConsoleLogger.logInfo(`Getting user info: ${userID}`);

    if (!userID && userID !== 0) {
      ConsoleLogger.logWarning(`User not found: ${userID}`);
      return res.sendStatus(409);
    }
    let user = await userService.getUserById(userID);
    return res.status(200).json(user);
  }
}
