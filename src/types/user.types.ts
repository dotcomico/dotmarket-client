/**
 * Global User type definitions
 * Used across auth, profile, and admin features
 */

export type UserRole = 'admin' | 'manager' | 'customer';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface UserWithTimestamps extends User {
  createdAt: string;
  updatedAt: string;
}