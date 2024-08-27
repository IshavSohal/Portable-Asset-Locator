export interface CustodianAsset {
    id: number;
    assetName: string;
    assetTag: string;
    type: string;
    location: string;
    age: number;
    dateOfPurchase?: Date | null;
    assignee?: string | null;
    assignedTo: string | null;
  }