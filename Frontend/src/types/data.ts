type user = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'Custodian' | 'Base';
};

type userAlt = {
    UID: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'Custodian' | 'Base';
};

type asset = {
    id: number;
    name: string;
    type: string;
    make?: string;
    assetTag: string;
    serialNumber?: string;
    description?: string;
    location?: string;
    warrantyStartDate?: string;
    warrantyEndDate?: string;
    warrantyDetails?: string;
    dateOfPurchase?: string;
    cost?: number;
    purchaser?: string;
    comment?: string;
    model?: string;
    custodian: custodian;
}

type custodian = {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
}

type request = {
    id: number;
    requestor: number;
    assignee: number;
    asset: number;
    requestStatusName: string;
    startDate: Date;          
    notes?: string;
}

export type { user, asset, custodian, request, userAlt }