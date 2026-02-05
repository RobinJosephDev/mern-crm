export type ShipmentType = "FTL" | "LTL";
export type TeamType = "Team" | "Single";

export interface ShipmentLocation {
  addressLine?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  unitNo?: string;
}

export interface ShipmentQuote {
  _id?: string;

  /* Shipment Info */
  shipmentNumber?: string;
  loadDate: string;

  pickupLocation: ShipmentLocation;
  deliveryLocation: ShipmentLocation;

  driverType: TeamType;
  shipmentType: ShipmentType;

  weight?: number;
  tarpRequired?: boolean;
  equipment?: string;

  price?: number;
  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}
