export type UserRole = "admin" | "employee" | "carrier" | "customer";

export interface User {
  _id?: string;

  name: string;
  email: string;
  role: UserRole;

  companyName?: string;
  phone?: string;

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}
