import express, { Express, Request, Response } from "express";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { AssetService } from "../Services/assetService";
import { Asset } from '@prisma/client';
import { UserService } from "../Services/userService";

const assetService = new AssetService();
const userService = new UserService();

export class AssetController {
    /**
     * Get the asset from given asset id
     */
    public async getAsset(id: number, res:Response) {
        let result = await assetService.getAssetById(id)

        if (result === null) {
            ConsoleLogger.logWarning("Asset ID does not exist");
            return res.sendStatus(409);
        } else {
            return res.status(200).json(result)
        }
    }

    /**
     * Get all assets belonging to a custodian given the custodian ID
     */
    public async getCustodianAssets(custodianID: number, res: Response) {
        let custodian = await userService.getUserById(custodianID);
        if (custodian?.roleName != 'Custodian') {
            ConsoleLogger.logWarning("This user ID does not have the role of 'Custodian'");
            return res.sendStatus(409);
        }

        let custodianAssets = await assetService.getCustodianAssets(custodianID)
        if (custodianAssets === null) {
            ConsoleLogger.logWarning("No assets exist for this custodian ID");
            return res.sendStatus(409);
        } else {
            return res.status(200).json(custodianAssets)
        }
    }

    /**
     * Get all assets belonging to a user given the user ID
     */
    public async getUserAssets(userID: number, res: Response) {
        let userAssets = await assetService.getUserAssets(userID);

        if (userAssets === null) {
            ConsoleLogger.logWarning("No assets exist for this user ID");
            return res.sendStatus(409);
        } else {
            return res.status(200).json(userAssets);
        }
    }

    /**
     * Create an asset
     */
    public async createAsset(data:Omit<Asset, 'id'>, res:Response) { 
        let custodian = await userService.getUserById(data.custodian)
        if (custodian === null || custodian.roleName != 'Custodian') {
            ConsoleLogger.logWarning("No custodian was found for this asset");
            return res.sendStatus(409);
        }

        let result = await assetService.createAsset(data)
        if (result === null) {
            ConsoleLogger.logWarning("Could not create asset");
            return res.sendStatus(409)
        } else {
            return res.status(201).json(result);
        }
    }
}