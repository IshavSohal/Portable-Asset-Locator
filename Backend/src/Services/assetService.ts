import { PrismaClient, Asset } from '@prisma/client';

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
     * @return {Promise<Asset[] | null>} An array of assets for that user, or null if not found
     */
    public async getUserCurrentAssets(userID: number): Promise<Asset[] | null> {
        // Fetch the active/current assignments for the user
        let userAssignments = await prisma.assignment.findMany({ where: { assignee: userID, endOfAssignment: null } });

        // Extract asset IDs from the assignments
        let userAssetIDs = userAssignments.map(assignment => assignment.asset); 

        // Fetch the assets using the asset IDs
        let userAssets = await Promise.all(
            userAssetIDs.map(id => prisma.asset.findUnique({ where: { id: id } }))
        );

        // Filter out any null values
        const validUserAssets = userAssets.filter((asset): asset is Asset => asset !== null);
        
        // Return the array of valid assets
        return validUserAssets;
    }
}