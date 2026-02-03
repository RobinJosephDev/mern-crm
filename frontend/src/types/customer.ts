/* -------------------- COMMON TYPES -------------------- */
export interface Contact {
  contactName: string;
  contactNo?: string;
  contactNoExt?: string;
  email?: string;
  fax?: string;
  designation?: string;
}

export interface Address {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  unitNo?: string;
}

/* -------------------- ACCOUNTS PAYABLE -------------------- */
export interface AccountsPayable {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  unitNo?: string;
  email?: string;
  phone?: string;
  phoneExt?: string;
  fax?: string;
}

/* -------------------- CUSTOMER CREDIT -------------------- */
export interface CustomerCredit {
  creditStatus?: "Approved" | "Pending" | "Rejected";
  modeOfPayment?: string;
  approvalDate?: string;
  expiryDate?: string;
  termsDays?: number;
  creditLimit?: number;
  notes?: string;
  currency?: "Canadian" | "USD";
  creditApplicationFile?: string;
  creditAgreementFile?: string;
  shipperBrokerAgreement?: boolean;
}

/* -------------------- CUSTOMER -------------------- */
export interface Customer {
  _id: string;
  customerType: string;
  customerName: string;
  customerRefNo?: string;
  website?: string;
  email?: string;
  contactNo?: string;
  contactNoExt?: string;
  taxId?: string;

  /* 🔹 CREDIT INFO */
  creditStatus?: string;
  paymentMode?: string;
  approvalDate?: string;
  expiryDate?: string;
  creditLimit?: number;
  creditNotes?: string;
  currency?: string;

  /* 🔹 ADDRESS */
  primaryAddress?: {
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    unitNo?: string;
  };

  /* 🔹 CONTACTS */
  contacts?: {
    contactName: string;
    contactNo?: string;
    contactNoExt?: string;
    email?: string;
    fax?: string;
    designation?: string;
  }[];
}
