import express, { Express, Request, Response } from "express";


export class HelloWorldController {
    public async helloWorld(req: Request, res: Response) {
        return res.send("Hello World")
    }
}