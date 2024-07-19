import { Console } from "console";
import express, { Express, Request, Response, NextFunction } from "express";
import { ConsoleLogger } from "../Logging/ConsoleLogger";

module.exports = function (req: Request, res: Response, next:NextFunction) {
    if (req.session.userId != undefined && req.session.userId){
        next();
    } else {
        ConsoleLogger.logWarning("Unauthenticated access attempt");
        res.sendStatus(401);
    }
  };