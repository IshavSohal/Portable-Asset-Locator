import { Request, Response } from "express";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { AssetService } from "../Services/assetService";
import { AssignmentService } from "../Services/assignmentService";
import { UserService } from "../Services/userService";
import { Request as AssetRequest } from '@prisma/client';
import { RequestService } from "../Services/requestService"

const assetService = new AssetService();
const assignmentService = new AssignmentService();
const userService = new UserService();
const requestService = new RequestService();

export class RequestController {

    public async createRequest(data:Omit<AssetRequest, 'id'>, res:Response){
        let request = await requestService.getRequestsByAsset(data.asset);
        if(request !== null && request !== [] && request.requestStatusName === 'Pending'){
            ConsoleLogger.logWarning("Asset already has a pending request");
            return res.sendStatus(409);
        }

        let assignee = await userService.getUserById(data.assignee);
        if(assignee === null){
            ConsoleLogger.logWarning("No user (assignee) was found with this ID");
            return res.sendStatus(400);
        }

        let asset = await assetService.getAssetById(data.asset);
        if(asset === null){
            ConsoleLogger.logWarning("No asset was found with this ID");
            return res.sendStatus(400);
        }

        let currDate = new Date();
        let startDate = Date.parse(data.startDate);
        if(startDate < currDate){
            ConsoleLogger.logWarning("Invalid start date");
            return res.sendStatus(400);  
        }

        let result = await requestService.createRequest(data);
        if(result === null){
            ConsoleLogger.logWarning("Could not create request");
            return res.sendStatus(409)
        } else {
            return res.status(201).json(result);
        }
    }


    public async getRequest(requestId: number, req: Request, res: Response){
        let result = await requestService.getRequestById(requestId);
        let currUser = req.session.user;

        if (result === null) {
            ConsoleLogger.logWarning("Request could not be found");
            return res.sendStatus(409);
        } else if (result.requestor !== currUser.id && currUser.role !== "Custodian") {
            ConsoleLogger.logWarning("User is neither the requestor nor a custodian");
            return res.sendStatus(403);
        } else {
            return res.status(200).json(result);
        }
    }

    public async getRequestsByAssetId(assetId: number, res: Response){
        let result = await requestService.getRequestsByAsset(assetId);

        if (result === null) {
            ConsoleLogger.logWarning("Error in attempt to retreive requests");
            return res.sendStatus(409);
        } else {
            return res.status(200).json(result);
        }
    }

    public async deleteRequest(requestId: number, req: Request, res: Response) {
        // check if request exists 
        let result = await requestService.getRequestById(requestId);
        if (result === null) {
            ConsoleLogger.logWarning("Request could not be found");
            return res.sendStatus(409);
        }

        result = await requestService.deleteRequestById(requestId);
        let currUser = req.session.user;

        if (result === null) {
            ConsoleLogger.logWarning("Request could not be deleted");
            return res.sendStatus(409);
        } else if (result.requestor !== currUser.id && currUser.role !== "Custodian") {
            ConsoleLogger.logWarning("User is neither the requestor nor a custodian");
            return res.sendStatus(403);
        } else {
            return res.status(200).json(result);
        }
    }

    public async updateRequest(requestId: number, data: Partial<AssetRequest>, req: Request, res: Response){
        let request = await requestService.getRequestById(requestId);
        if (request === null) {
            ConsoleLogger.logWarning("Request could not be found");
            return res.sendStatus(409);
        }

        // common fields are overriden by respective values in data
        let partialRequest = {...data}
        let result = await requestService.updateRequest(requestId, partialRequest);
        let currUser = req.session.user;
        
        if (result === null) {
            ConsoleLogger.logWarning("Request could not be updated");
            return res.sendStatus(409);
        } else if (result.requestor !== currUser.id && currUser.role !== "Custodian") {
            ConsoleLogger.logWarning("User is neither the requestor nor a custodian");
            return res.sendStatus(403);
        } else {
            return res.status(200).json(result);
        }
    }


    public async getAllPendingRequests(res: Response){
        let pendingRequests = await requestService.getAllPendingRequests();

        if (pendingRequests === null) {
            ConsoleLogger.logWarning("Error in attempt to retreive requests");
            return res.sendStatus(409);
        } else {
            for (let i=0; i < pendingRequests.length; i++){
                let assignee = await userService.getUserById(pendingRequests[i].assignee);
                if(assignee === null){
                    ConsoleLogger.logWarning(`No user (assignee) was found with ID ${assignee.UID}`);
                    return res.sendStatus(400);
                } else{
                    delete assignee.password;
                    delete assignee.iv;
                    pendingRequests[i].assignee = assignee;
                }

                let requestor = await userService.getUserById(pendingRequests[i].requestor);
                if(requestor === null){
                    ConsoleLogger.logWarning(`No user (requestor) was found with ID ${requestor.UID}`);
                    return res.sendStatus(400);
                } else{
                    delete requestor.password;
                    delete requestor.iv;
                    pendingRequests[i].requestor = requestor;
                }

                let asset = await assetService.getAssetById(pendingRequests[i].asset);
                if(asset === null){
                    ConsoleLogger.logWarning(`No asset was found with ID ${asset.id}`);
                    return res.sendStatus(400);
                } else{
                    pendingRequests[i].asset = asset;
                }
            }

            return res.status(200).json(pendingRequests);
        }
    }

}


