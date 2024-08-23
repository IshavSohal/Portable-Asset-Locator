import { PrismaClient, Request } from '@prisma/client';
import { ConsoleLogger } from "../Logging/ConsoleLogger";

const prisma = new PrismaClient();

export class RequestService {

public async getRequestById(id: number): Promise<Request | null> {
    return prisma.request.findUnique({where: {id: id}});
}

public async getRequestByAsset(assetid: number): Promise<Request | null> {
    return prisma.request.findFirst({where: {asset: assetid}});
}

public async getAllPendingRequests(): Promise<Request[]> {
    return prisma.request.findMany({where: {requestStatusName: 'Pending'}});
}

public async createRequest(data: Omit<Request, 'id'>): Promise<Request> {
    return prisma.request.create({ data });
}

// TODO: create a method that will update a request in the DB given an updated Request object. The implementation approach
// for this can vary, I leave it up to the person working on this to decide how they want to do this
}