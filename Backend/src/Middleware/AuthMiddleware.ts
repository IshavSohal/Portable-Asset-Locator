import { Request, Response, NextFunction } from "express";
import { ConsoleLogger } from "../Logging/ConsoleLogger";

function isAuthenticated (req: Request, res: Response, next:NextFunction) {
    if (req.session.user) {
        next();
    } else {
        ConsoleLogger.logWarning("Unauthenticated access attempt");
        res.sendStatus(401);
    }
};

function isCustodian(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        if (req.session.user.role == "Custodian") {
            next();
        } else {
            ConsoleLogger.logWarning("Non-custodian access attempt");
            res.sendStatus(403);
        }
    } else {
        ConsoleLogger.logWarning("Unauthenticated access attempt");
        res.sendStatus(401);
    }
}

module.exports = { isAuthenticated, isCustodian }