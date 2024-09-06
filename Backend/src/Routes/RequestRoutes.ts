import express, { Express, NextFunction, Request, Response, Router } from "express";
import { RequestController } from "../Controllers/RequestController";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { body } from "express-validator";
const { check, validationResult } = require('express-validator');

var authMiddleware = require("../Middleware/AuthMiddleware");

export const requestRoutes = Router();
const requestController = new RequestController;

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    ConsoleLogger.logWarning(errors.errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

/**
 *  Get all pending requests
 */
requestRoutes.get(
    "",
    authMiddleware.isCustodian, 
    handleValidationErrors,
    async (req: Request, res: Response) => {
        ConsoleLogger.logInfo('Obtaining all requests');
        const errors = validationResult(req);

        // If JSON validation fails, send a 400, Conflict
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        return await requestController.getAllPendingRequests(res);
    }
);

/**
 *  Get the request given the request ID
 */
requestRoutes.get(
    "/:id",
    authMiddleware.isAuthenticated,
    handleValidationErrors,
    async (req: Request, res: Response) => {
        ConsoleLogger.logInfo('Obtaining a request');
        const errors = validationResult(req);

        // If JSON validation fails, send a 400, Conflict
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let id = parseInt(req.params.id, 10);
        return await requestController.getRequest(id, req, res);
    }
);

/**
 *  Create a request
 */
requestRoutes.route("")
    .post(
        [
            body("assignee").exists().withMessage("Assignee is required").isInt().withMessage('Assignee must be a valid user ID'),
            body("asset").exists().withMessage("Asset is required").isInt().withMessage('Asset must be a valid asset ID'),
            body("startDate").exists().withMessage("Start date is required").isISO8601().withMessage("Start date must be a valid ISO 8601 date-time"),
            body("notes").optional()
        ],
        authMiddleware.isAuthenticated,
        handleValidationErrors,
        async (req: Request, res: Response) => {
            ConsoleLogger.logInfo("Creating a request");
            const errors = validationResult(req);
            // If JSON validation fails, send a 400, Conflict
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let data = {
                assignee: req.body.assignee as number, 
                asset: req.body.asset as number, 
                startDate: req.body.startDate as Date, 
                notes: req.body.notes ?? null,
                requestor: req.session.user!.id as number, 
                requestStatusName: 'Pending'
            }
            
            return await requestController.createRequest(data, res);
        }
    )


module.exports = requestRoutes;