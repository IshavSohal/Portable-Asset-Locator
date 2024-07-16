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
     * Get an asset by its id
     * 
     * @param {number} id The ID of the asset to retrieve 
     * @returns {Promise<Asset | null>} The asset with the specified ID, or null if not found
     */
    public async getAssetById(id: number): Promise<Asset | null> {
        return prisma.asset.findUnique({ where: { id: id } })
    }
}