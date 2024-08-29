import { PrismaClient, Asset } from '@prisma/client';
import { ConsoleLogger } from "../Logging/ConsoleLogger";

type AssignedAsset = Asset & {
    assignedOn: Date
}

type AssignedAsset = Asset & {
    assignedOn: Date
}

const prisma = new PrismaClient();

/**
 *  The AssetService class
 * 
 *  Use this to access CRUD (create, read, update, delete) operations for the Asset table
 */
export class AssetService {
    /**
     * Creates a new asset
     * 
     * @param {Asset} data The data for the new asset
     * @returns {Promise<Asset>} The created asset
     */
    public async createAsset(data: Omit<Asset, 'id'>): Promise<Asset> {
        return prisma.asset.create({ data })
    }

    /**
     * Get an asset by its ID
     * 
     * @param {number} id The ID of the asset to retrieve 
     * @returns {Promise<Asset | null>} The asset with the specified ID, or null if not found
     */
    public async getAssetById(id: number): Promise<Asset | null> {
        return prisma.asset.findUnique({ where: { id: id } })
    }

    /**
     * Get all assets belonging to a custodian
     * 
     * @param {number} custodianID The ID of the custodian
     * @returns {Promise<Asset[]>} An array of the custodians assets
     */
    public async getCustodianAssets(custodianID: number): Promise<Asset[]> {
        return prisma.asset.findMany({ where: {custodian: custodianID} });
    }

    /**
     * Get all assets belonging to a user
     * 
     * @param {number} userID The ID of the user
     * @return {Promise<Asset[] | null>} An array of assets for that user
     */
    public async getUserCurrentAssets(userID: number): Promise<AssignedAsset[]> {
        // Fetch the active/current assignments for the user
        let userAssignments = await prisma.assignment.findMany({ where: { assignee: userID, endOfAssignment: null } });

        // If no assignments are found, return an empty array
        if (!userAssignments.length) {
            return [];
        }

        let userAssetsAlt = await Promise.all(
            userAssignments.map(async assignment => { 
                try {
                    // Fetch the asset related to the assignment
                    let asset = await prisma.asset.findUniqueOrThrow({
                        where: { id: assignment.asset }
                    });
                    return { asset, assignedOn: assignment.startOfAssignment };
                } catch (error) {
                    ConsoleLogger.logInfo("Error fetching asset")
                    return null;
                }
            })
        );

        // Filter out any null assets and map the results
        return userAssetsAlt
            .filter((object): object is { asset: any; assignedOn: Date } => !!object)
            .map(({ asset, assignedOn }) => ({ ...asset, assignedOn }));
    }

    /**
     * Get all unassigned assets
     * 
     * @return {Promise<Asset[]>} An array of unassigned assets
     */
    public async getUnassignedAssets(): Promise<Asset[] | null> {
        // Fetch all assignments
        let assignments = await prisma.assignment.findMany();

        // Filter out assignments that have already ended
        const currentDate = new Date();
        assignments = assignments.filter(assignment =>
            !assignment.endOfAssignment || new Date(assignment.endOfAssignment) >= currentDate
        );

        // Fetch all assets
        let assets = await prisma.asset.findMany();

        // Filter out assets that are not in the assignments - these are unassigned
        return assets.filter(asset => !assignments.some(assignment => assignment.asset === asset.id));
    }
}