"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRatingSchema = exports.createRatingSchema = exports.updateStoreSchema = exports.createStoreSchema = exports.updateUserSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// AUTH
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(1),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6),
});
// USERS
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.email().optional(),
});
// STORES
exports.createStoreSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
});
exports.updateStoreSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
// RATINGS
exports.createRatingSchema = zod_1.z.object({
    storeId: zod_1.z.string().min(1),
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().optional(),
});
exports.updateRatingSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5).optional(),
    comment: zod_1.z.string().optional(),
});
