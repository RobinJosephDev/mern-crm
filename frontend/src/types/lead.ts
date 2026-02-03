export interface Contact {
  contactName: string;
  contactNo: string;
  email: string;
}

export interface Address {
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  unitNo?: string;
}

export interface Lead {
  _id?: string;
  leadNumber: string;
  leadDate: string;
  followUpDate: string;
  leadType: string;
  leadStatus: string;
  customerName?: string;
  phone: string;
  email: string;
  website?: string;
  equipmentType?: string;
  address?: Address;
  contacts?: Contact[];
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
  isConverted?: boolean;
}
