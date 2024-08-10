import express, { Express, Request, Response, Router } from "express";
import { HelloWorldController } from "../Controllers/HelloWorldController";
// var requireAuth = require("../Middleware/AuthMiddleware");


export const helloWorldRoute = Router();
const helloWorldController = new HelloWorldController;

helloWorldRoute.route("/")
    .get((req: Request, res: Response) => {
        res.sendStatus(200);
    });
helloWorldRoute.route("/start")
    .get((req: Request, res: Response) => {
        helloWorldController.helloWorld(req, res);
    });

module.exports = helloWorldRoute;