export enum Role {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  address?: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  address: string;
  averageRating?: number;
  ownerId?: string;
  myRating?: number;
}

export interface Rating {
  id: string;
  storeId: string;
  userId: string;
  rating: number;
  comment: string;
  user?: User; // For display purposes
}

export interface AuthResponse {
  accessToken?: string;
  token?: string;
  user?: User;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}