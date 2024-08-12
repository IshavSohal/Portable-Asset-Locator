import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

/**
 *  The UserService class
 * 
 *  Use this to access CRUD (create, read, update, delete) operations for the User table
 */
export class UserService {
    /**
     * Create a new user
     * 
     * @param {User} data The data for the new user
     * @returns {Promise<User>} The created user
     */
    public async createUser(data: Omit<User, 'UID'>): Promise<User> {
        return prisma.user.create({ data });
    }

    /**
     * Create multiple new users
     * 
     * @param {User[]} data An array of data for the new users
     * @returns {Promise<{ count: number }>} The number of users created
     */
    public async createUsers(data: User[]): Promise<{ count: number }> {
        return prisma.user.createMany({ data })
    }

    /**
     * Get a user by their ID
     * 
     * @param {number} id The ID of the user to retrieve 
     * @returns {Promise<User | null>} The user with the specified ID, or null if not found
     */
    public async getUserById(UID: number): Promise<User | null> {
        return prisma.user.findUnique({ where: { UID } });
    }

    /**
     * Get a user by their email
     * 
     * @param {string} email The email of the user to retrieve
     * @returns {Promise<User | null>} The user with the specific email, null if not found
     */
    public async getUserByEmail(email: string) : Promise<User | null>{
        return prisma.user.findUnique({ 
            where: { email: email },
        });
    }

    /**
     * Update a user's data
     * 
     * @param {number} id The ID of the user to update 
     * @param {Partial<User>} data The new data for the user 
     * @returns {Promise<User>} The updated user
     */
    public async updateUser(UID: number, data: Partial<User>): Promise<User> {
        return prisma.user.update({ where: { UID }, data });
    }

    /**
     * Delete a user
     * 
     * @param {number} id The ID of the user to delete 
     * @returns {Promise<User>} The delete user
     */
    public async deleteUser(UID: number): Promise<User> {
        return prisma.user.delete({ where: { UID } });
    }

    /**
     * Gets all users
     * 
     * @returns {Promise<User[]>} An array of all users
     */
    public async getAllUsers(): Promise<User[]> {
        return prisma.user.findMany();
    }
}