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

export interface UnassignedAsset {
    id: number;
    name: string;
    type: string;
    procurementYear: number;
    custodian: string | null;
    location: string;
  }