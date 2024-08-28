import { Response } from "express";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { AssetService } from "../Services/assetService";
import { AssignmentService } from "../Services/assignmentService";
import { UserService } from "../Services/userService";
import { Assignment } from '@prisma/client';

const assetService = new AssetService();
const assignmentService = new AssignmentService();
const userService = new UserService();

export class AssignmentController {
    /**
     * End an assignment given the assignment ID
     */
    public async endAssignment(assignmentID: number, res: Response) {
        let assignment = await assignmentService.getAssignmentById(assignmentID)

        if (assignment === null) {
            ConsoleLogger.logWarning("Assignment could not be found");
            return res.sendStatus(409);
        }

        assignment.endOfAssignment = new Date();
        if (assignment.id) {
            delete (assignment as any).id;
        }

        let result = await assignmentService.updateAssignment(assignmentID, assignment);

        return res.status(200).json(result);
    }

    /**
     * Get an assignment given the assignment ID
     */
    public async getAssignment(assignmentID: number, res:Response) {
        let result = await assignmentService.getAssignmentById(assignmentID)

        if (result === null) {
            ConsoleLogger.logWarning("Assignment could not be found");
            return res.sendStatus(409);
        } else {
            return res.status(200).json(result)
        }
    }

    /**
     * Get all assignments belonging to a user give the user ID
     */
    public async getUserAssignments(userID: number, res: Response) {
        let userAssignments = await assignmentService.getUserAssignments(userID);

        if (userAssignments === null) {
            ConsoleLogger.logWarning("Assignment(s) could not be found");
            return res.sendStatus(40)
        } else {
            return res.status(200).json(userAssignments);
        }
    }

    /**
     * Create an assignment
     */
    public async createAssignment(data:Omit<Assignment, 'id'>, res:Response) { 
        let user = await userService.getUserById(data.assignee);
        if (user === null) {
            ConsoleLogger.logWarning("No user was found with this ID");
            return res.sendStatus(409);
        }

        let asset = await assetService.getAssetById(data.asset);
        if (asset === null) {
            ConsoleLogger.logWarning("No asset was found with this ID");
            return res.sendStatus(409);
        }

        let result = await assignmentService.createAssignment(data)
        if (result === null) {
            ConsoleLogger.logWarning("Could not create assignment");
            return res.sendStatus(409)
        } else {
            return res.status(201).json(result);
        }
    }
}