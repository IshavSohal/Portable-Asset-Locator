import { PrismaClient, Request } from '@prisma/client';
import { ConsoleLogger } from "../Logging/ConsoleLogger";

const prisma = new PrismaClient();

export class RequestService {

    public async getRequestById(id: number): Promise<Request | null> {
        return prisma.request.findUnique({where: {id: id}});
    }

    public async getRequestsByAsset(assetid: number): Promise<Request | null> {
        return prisma.request.findMany({where: {asset: assetid}});
    }

    public async getAllPendingRequests(): Promise<Request[]> {
        return prisma.request.findMany({where: {requestStatusName: 'Pending'}});
    }

    public async createRequest(data: Omit<Request, 'id'>): Promise<Request> {
        return prisma.request.create({ data });
    }

    public async deleteRequestById(id: number):  Promise<Request | null> {
        return prisma.request.delete({where: {id: id}});
    }

    public async updateRequest(id: number, data: Omit<Partial<Request>, 'id'>): Promise<Request>{
        return prisma.request.update({where: {id:id}, omit: {id: true}, data})
    }
}