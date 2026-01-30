/**
 * Global User type definitions
 * Used across auth, profile, and admin features
 */

export type UserRole = 'admin' | 'manager' | 'customer';

// export interface Address {
//   street: string;
//   houseNumber: string;
//   apartment: string;
//   city: string;
//   zipCode: string;
// }

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  // address?: Address;
}

export interface UserWithTimestamps extends User {
  createdAt: string;
  updatedAt: string;
}