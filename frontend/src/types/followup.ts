export interface Contact {
  contactName: string;
  contactNo: string;
  email: string;
}
export interface Product {
  productName: string;
  quantity: string;
}

export interface Address {
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  unitNo?: string;
}

export interface FollowUp {
  _id?: string;
  leadStatus: string;
  followUpDate: string;
  followUpType: string;
  remarks: string;
  equipmentType: string;
  leadNumber: string;
  leadDate: string;
  customerName?: string;
  phone: string;
  email: string;
  leadType: string;
  address?: Address;
  contacts?: Contact[];
  products?: Product[];
  notes?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
}
