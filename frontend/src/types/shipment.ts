export type ShipmentType = "FTL" | "LTL";
export type TeamType = "Team" | "Single";
export type YesNo = "Yes" | "No";

export interface ShipmentLocation {
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  unitNo?: string;
}

export interface Shipment {
  _id?: string;

  /* Shipment Info */
  shipmentNumber?: string;
  loadDate: string;

  pickupLocation: ShipmentLocation;
  deliveryLocation: ShipmentLocation;

  driverType: string;

  shipmentType: ShipmentType;

  weight?: number;
  tarp?: YesNo;
  equipment?: string;

  price?: number;
  notes?: string;

  createdAt?: string;
  updatedAt?: string;
}
