import express, { Express, Request, Response } from "express";
import { ConsoleLogger } from "../Logging/ConsoleLogger";

export class HelloWorldController {
    public async helloWorld(req: Request, res: Response) {
        ConsoleLogger.log('Hello World response processed');
        return res.status(200).send("Hello World");
    }
}