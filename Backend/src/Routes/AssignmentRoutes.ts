import { NextFunction, Request, Response, Router } from "express";
import { AssignmentController } from "../Controllers/AssignmentController";
import { ConsoleLogger } from "../Logging/ConsoleLogger";
import { body } from "express-validator";
import { AssetService } from "../Services/assetService";

const { validationResult } = require("express-validator");
var authMiddleware = require("../Middleware/AuthMiddleware");
const assetService = new AssetService();

export const assignmentRoutes = Router();
const assignmentController = new AssignmentController();

const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  ConsoleLogger.logWarning(errors.errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * End an assignment - this sets the end date of the assignment
 * to the current time if processed successfully
 */
assignmentRoutes.patch(
    '/end/:id',
    authMiddleware.isCustodian,
    async (req: Request, res: Response) => {
        ConsoleLogger.logInfo('Requesting unassignment attempt');
        const errors = validationResult(req);

    // If JSON validation fails, send a 400, Conflict
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let id = parseInt(req.params.id, 10);

    return await assignmentController.endAssignment(id, res);
  }
);

/**
 *  Get the assignment given the assignment ID
 */
assignmentRoutes.get("/:id", async (req: Request, res: Response) => {
  ConsoleLogger.logInfo("Requesting assignment attempt");
  const errors = validationResult(req);

  // If JSON validation fails, send a 400, Conflict
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let id = parseInt(req.params.id, 10);

  return await assignmentController.getAssignment(id, res);
});

/**
 *  Get the current assignment given the asset ID
 */
assignmentRoutes.get("/asset/:id", async (req: Request, res: Response) => {
  ConsoleLogger.logInfo("Requesting current asset assignment attempt");
  const errors = validationResult(req);

  // If JSON validation fails, send a 400, Conflict
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let id = parseInt(req.params.id, 10);

  return await assignmentController.getActiveAssetAssignment(id, res);
});

/**
 * Create an assignment
 */
assignmentRoutes.route("")
    .post(
        [
         body("assignee").exists().withMessage("Assignee is required").isInt().withMessage('Assignee must be a valid user ID'),
         body("asset").exists().withMessage("Asset is required").isInt().withMessage('Asset must be a valid asset ID'),
         // body("startOfAssignment").exists().withMessage("Start of assignment is required").isISO8601().withMessage("Start of assignment must be a valid ISO 8601 date-time"),
         body("endOfAssignment").optional().isISO8601().withMessage("End of assignment must be a valid ISO 8601 date-time")
        ],
        authMiddleware.isCustodian,
        handleValidationErrors,
        async (req: Request, res: Response) => {
            ConsoleLogger.logInfo('Creating an assignment');
            const errors = validationResult(req);
            // If JSON validation fails, send a 400, Conflict
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            let data = {
                assignee: req.body.assignee as number,
                asset: req.body.asset as number,
                // startOfAssignment: req.body.startOfAssignment as Date, 
                endOfAssignment: req.body.endOfAssignment ? req.body.endOfAssignment as Date : null,
                startOfAssignment: new Date(),
            }

            return await assignmentController.createAssignment(data, req, res);
        }
    );

module.exports = assignmentRoutes;
