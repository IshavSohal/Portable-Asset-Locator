type user = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'Custodian' | 'Base';
};

type assignment = {
    id: number;
    assigneeId: user;
    assignee: number;
    assetID: asset;
    asset: number;
    startOfAssignment: string;
    endOfAssignment?: string;
}

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
    firstName?: string,
    lastName?: string,
    email?: string,
}

export type { user, assignment, asset, custodian, userAlt }