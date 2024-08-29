import { NextFunction, Request, Response, Router } from "express";
import { AssetController } from "../Controllers/AssetController";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { body } from "express-validator";
import { Decimal } from "@prisma/client/runtime/library";

const { validationResult } = require('express-validator');
var authMiddleware = require("../Middleware/AuthMiddleware");
export const assetRoutes = Router();

const assetController = new AssetController;

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    ConsoleLogger.logWarning(errors.errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

/**
 * Get list of unassigned assets
 */
assetRoutes.get(
    '/unassigned',
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        // If JSON validation fails, send a 400, Conflict
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        ConsoleLogger.logInfo(`Attempt to retrieve unassigned assets`);
        return await assetController.getUnassignedAssets(res);
    }
)

/**
 * Get all assets for a user given the user ID
 */
assetRoutes.get(
    '/user/:id',
    async (req: Request, res: Response) => {
        ConsoleLogger.logInfo('Getting user assets');
        const errors = validationResult(req);

        // If JSON validation fails, send a 400, Conflict
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let userID = parseInt(req.params.id, 10)

        return await assetController.getUserAssets(userID, res);
    }
)

/**
 * Get all assets belonging to the currently logged in user
 */
assetRoutes.get(
    '/user',
    authMiddleware.isAuthenticated,
    async (req: Request, res: Response) => {
        ConsoleLogger.logInfo('Getting user assets');
        const errors = validationResult(req);

        // If JSON validation fails, send a 400, Conflict
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let userID = req.session.user!.id;

        return await assetController.getUserAssets(userID, res);
    }
)

/**
 * Get all assets belonging to the currently logged in custodian
 */
assetRoutes.get(
    '/custodian',
    authMiddleware.isCustodian,
    async (req: Request, res: Response) => {
        ConsoleLogger.logInfo('Getting custodian assets attempt');
        const errors = validationResult(req);

        // If JSON validation fails, send a 400, Conflict
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let custodianID = req.session.user!.id;

        return await assetController.getCustodianAssets(custodianID, res)
    }
)

/**
 * Get all assets under a custodian given the custodian ID
 */
assetRoutes.get(
    '/custodian/:id',
    async (req: Request, res: Response) => {
        ConsoleLogger.logInfo('Getting custodian assets attempt');
        const errors = validationResult(req);

        // If JSON validation fails, send a 400, Conflict
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let custodianID = parseInt(req.params.id, 10)

        return await assetController.getCustodianAssets(custodianID, res)
    }
)

/**
 * Get an asset given the asset ID
 */
assetRoutes.get(
    '/:id', 
    async (req: Request, res: Response) => {
        
        const errors = validationResult(req);

        // If JSON validation fails, send a 400, Conflict
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //let id = req.body.id as number;
        let id = parseInt(req.params.id, 10);
        if (isNaN(id)){
            return res.sendStatus(400);
        }
        
        ConsoleLogger.logInfo(`Attempt to retrieve asset information for id=${id}`);
        return await assetController.getAsset(id, res)
    }
)

/**
 * Create an asset
 */
assetRoutes.route("")
    .post(
        [body("name").exists().withMessage("Name is required").isString().withMessage('Name must be a valid string'),
         body("type").exists().withMessage("Type is required").isString().withMessage('Type must be a valid string'),
         body("make").optional().isString().withMessage("Make must be a valid string"),
         body("model").optional().isString().withMessage("Model must be a valid string"),
         body("assetTag").exists().isLength({ min: 6, max: 6 }).withMessage("Asset Tag must be 6 characters long").isString().withMessage("Asset tag must be a valid string"),
         body("serialNumber").optional().isString().withMessage("Serial number must be a valid string"),
         body("description").optional().isString().withMessage("Description must be a valid string"),
         body("custodian").exists().withMessage("Custodian is required").isInt().withMessage("Custodian must be a valid user ID"),
         body("location").exists().withMessage("Location is required").isString().withMessage("Location must be a valid string").isIn(['NCR', 'Toronto', 'Burlington']).withMessage('Location must be one of: NCR, Toronto, Burlington'),
         body("warrantyStartDate").optional().isISO8601().withMessage("Warranty start date must be a valid ISO 8601 date-time"),
         body("warrantyEndDate").optional().isISO8601().withMessage("Warranty end date must be a valid ISO 8601 date-time"),
         body("warrantyDetails").optional().isString().withMessage("Warranty details must be a valid string"),
         body("dateOfPurchase").optional().isISO8601().withMessage("Date of purchase must be a valid ISO 8601 date-time"),
         body("cost").optional().isDecimal({ decimal_digits: '0,2' }).withMessage("Cost must be a valid decimal with up to two decimal places"),
         body("purchaser").optional().isString().withMessage("Purchaser must be a valid string"),
         body("comment").optional().isString().withMessage("Comment must be a valid string")
        ],
        authMiddleware.isCustodian,
        handleValidationErrors,
        async (req: Request, res: Response) => {
            ConsoleLogger.logInfo('Attempt to create new asset');
            const errors = validationResult(req);
            // If JSON validation fails, send a 400, Conflict
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            let data = {
                name: req.body.name as string,
                type: req.body.type as string,
                make: req.body.make ? req.body.make as string : null,
                model: req.body.model ? req.body.model as string : null,
                assetTag: req.body.assetTag as string,
                serialNumber: req.body.serialNumber ? req.body.serialNumber as string : null,
                description: req.body.description ? req.body.description as string : null,
                custodian: req.body.custodian as number,
                location: req.body.location as string,
                warrantyStartDate: req.body.warrantyStartDate ? req.body.warrantyStartDate as Date : null,
                warrantyEndDate: req.body.warrantyEndDate ? req.body.warrantyEndDate as Date : null,
                warrantyDetails: req.body.warrantyDetails ? req.body.warrantyDetails as string : null,
                dateOfPurchase: req.body.dateOfPurchase ? req.body.dateOfPurchase as Date : null,
                cost: req.body.cost ? req.body.cost as Decimal : null,
                purchaser: req.body.purchaser ? req.body.purchaser as string : null,
                comment: req.body.comment ? req.body.comment as string : null
            }

            return await assetController.createAsset(data, res);
        }
    );

module.exports = assetRoutes;