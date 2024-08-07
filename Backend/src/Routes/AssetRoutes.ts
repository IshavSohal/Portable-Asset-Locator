import express, { Express, Request, Response, Router } from "express";
import { AssetController } from "../Controllers/AssetController";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { body } from "express-validator";
import { Decimal } from "@prisma/client/runtime/library";
const { check, validationResult } = require('express-validator');

export const assetRoutes = Router();
const assetController = new AssetController;

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

assetRoutes.route("")
    .post(
        [body("name").exists(),
         body("type").exists(),
         body("assetTag").exists(),
         body("custodian").exists(),
         body("location").exists()
        ],
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