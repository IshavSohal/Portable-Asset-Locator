import express, { Express, Request, Response } from "express";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { UserService } from "../Services/userService";
import { EncryptionProvider } from "../Services/EncryptionProvider";
import { User } from '@prisma/client';

const userService = new UserService();
const encryptionProvider = new EncryptionProvider();

export class AuthenticationController {

    // Registers a user in the DB
    // If a user with the same email already exists, send a conflict
    // Encrypts the password to be stored in the DB
    public async Register(email:string, password:string, firstName:string, lastName:string, roleName:string, res:Response){
        if ((await userService.getUserByEmail(email)) != null){
            ConsoleLogger.logWarning("User email conflict");
            return res.sendStatus(409);
        }

        let encryptedPassword = encryptionProvider.Encrypt(password);
        userService.createUser({
            email: email,
            password: encryptedPassword,
            firstName: firstName,
            lastName: lastName,
            roleName: roleName
        });
        return res.sendStatus(201);
    }
}