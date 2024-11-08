import { PrismaClient, Assignment } from '@prisma/client';

const prisma = new PrismaClient();

/**
 *  The AssignmentService class
 * 
 *  Use this to access CRUD (create, read, update, delete) operations for the Assignment table
 */
export class AssignmentService {
     /**
     * Creates a new assignment
     * 
     * @param {Assignment} data The data for the new assignment
     * @returns {Promise<Assignment>} The created assignment
     */
     public async createAssignment(data: Omit<Assignment, 'id'>): Promise<Assignment> {
        return prisma.assignment.create({ data });
    }

    /**
     * Create multiple new assignments
     * 
     * @param {Assignment[]} data An array of data for the new assignments
     * @returns {Promise<{ count: number }>} The number of assignments created
     */
    public async createAssignments(data: Assignment[]): Promise<{ count: number }> {
        return prisma.assignment.createMany({ data })
    }

    /**
     * Get an assignment by its ID
     * 
     * @param {number} assignmentID The ID of the assignment to retrieve 
     * @returns {Promise<User | null>} The assignment with the specified ID, or null if not found
     */
    public async getAssignmentById(assignmentID: number): Promise<Assignment | null> {
        return prisma.assignment.findUnique({ where: { id: assignmentID } });
    }

    /**
     * Get all assignment(s) for a user 
     * 
     * @param {number} userID The ID of the user
     * @return {Promise<Assignment[]>} An array of assignments for that user, or null if not found
     */
    public async getUserAssignments(userID: number): Promise<Assignment[]> {
        return prisma.assignment.findMany({ where: {assignee: userID} });
    }

    /**
     * Update an assignment
     * 
     * @param {number} assignmentID The ID of the assignment
     * @param {Partial<Assignment>} data The new data for the assignment
     * @returns {Promise<Assignment>} The updated assignment
     */
    public async updateAssignment(assignmentID: number, data: Omit<Assignment, 'id'>): Promise<Assignment> {
        return prisma.assignment.update({ where: { id: assignmentID }, data });
    }

    /**
     * Delete an assignment
     * 
     * @param {number} assignmentID The ID of the assignment
     * @returns {Promise<Assignment>} The deleted assignment
     */
    public async deleteAssignment(assignmentID: number): Promise<Assignment> {
        return prisma.assignment.delete({ where: { id: assignmentID } });
    }

    /**
     * Gets all assignments
     * 
     * @returns {Promise<Assignment[]>} An array of all assignments
     */
    public async getAllAssignments(): Promise<Assignment[]> {
        return prisma.assignment.findMany();
    }

    /**
     * Gets all active assignments for the given asset
     * 
     * @returns {Promise<Assignment[]>} An array of all assignments
     */
    public async getActiveAssignmentFor(assetID: number): Promise<Assignment|null> {
        return prisma.assignment.findFirst({ 
            where: {
                OR: [
                    { asset: assetID, endOfAssignment: null }, 
                    { asset: assetID, endOfAssignment: { gt: new Date() } } 
                ]
            }
        });

    }
}