export interface CustodianAsset {
    id: number;
    name: string;
    assetTag: string;
    type: string;
    location: string;
    age: number;
    dateOfPurchase?: Date | null;
    assignedTo?: string | null;
  }

export interface Request {
    id: number;
    requestor: RequestUser;
    assignee: RequestUser;
    asset: RequestAsset;
    requestStatusName: 'Pending' | 'Approved' | 'Declined' | 'Cancelled'
    startDate: string;
    notes?: string
};

export interface RequestUser {
  UID: number;
  email: string;
  firstName: string;
  lastName: string;
  roleName: 'Admin' | 'Custodian' | 'Base';
}

export interface RequestAsset extends CustodianAsset {
  custodian: number  
}
