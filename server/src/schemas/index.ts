import { z } from "zod";

// AUTH
export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

// USERS
export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
});

// STORES
export const createStoreSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateStoreSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

// RATINGS
export const createRatingSchema = z.object({
  storeId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const updateRatingSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});
