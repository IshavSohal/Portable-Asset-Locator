import express, { Express, Request, Response } from "express";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { AssetService } from "../Services/assetService";
import { Asset } from '@prisma/client';
import { UserService } from "../Services/userService";

const assetService = new AssetService();
const userService = new UserService();

export class AssetController {
    // Get the asset from given id
    // If no asset is found, send a conflict
    public async getAsset(id: number, res:Response) {
        let result = await assetService.getAssetById(id)

        if (result === null) {
            ConsoleLogger.logWarning("Asset ID does not exist");
            return res.sendStatus(409);
        } else {
            return res.status(200).json(result)
        }
    }

    //public async createAsset(name:string, type:string, make:string, model:string, assetTag:string, serialNumber:string, description:string, res:Response) {
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