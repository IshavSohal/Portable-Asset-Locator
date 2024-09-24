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
  make?: string;
  model?: string;
  type: string;
  dateOfPurchase?: Date | null;
  custodianEmail?: string;
  location: string;
}

export interface AssetType{
  id: number;
  type: string;
}

export interface Locations{
  id: number;
  location: string;
}

export interface CustodianEmails{
  UID: number;
  email: string;
}