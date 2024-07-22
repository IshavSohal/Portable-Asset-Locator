import express, { Express, Request, Response, NextFunction } from "express";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { UserService } from "../Services/userService";
import { EncryptionProvider } from "../Services/EncryptionProvider";
import { User } from '@prisma/client';
import AuthConflictError from "../Errors/AuthConflictError";

const userService = new UserService();
const encryptionProvider = new EncryptionProvider();

export class AuthenticationController {
    // Registers a user in the DB
    // If a user with the same email already exists, send a conflict
    // Encrypts the password to be stored in the DB
    public async Register(email:string, password:string, firstName:string, lastName:string): Promise<User>{
        if ((await userService.getUserByEmail(email)) != null){
            ConsoleLogger.logWarning("User email conflict");
            throw new AuthConflictError("User already exists", 409);
        }

        let encryptedPassword = encryptionProvider.Encrypt(password);
        var createdUser = await userService.createUser({
            email: email,
            password: encryptedPassword[0],
            firstName: firstName,
            lastName: lastName,
            roleName: "Base",
            iv:encryptedPassword[1]
        });
        
        return createdUser;
    }


    public async Authenticate(email: string, password: string): Promise<User | null>{
        var requestedUser = await userService.getUserByEmail(email);
        if (requestedUser == null){
            throw new AuthConflictError("User doesn't exist", 404);
        }
        if (encryptionProvider.EncryptionComparison(requestedUser.password, password, requestedUser.iv)){
            return requestedUser;
        }
        throw new AuthConflictError("User doesn't exist", 404);
    }
}

