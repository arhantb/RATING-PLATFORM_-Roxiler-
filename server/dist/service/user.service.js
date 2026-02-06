"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
const client_1 = require("../generated/prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    static getInstance() {
        if (!this.instance)
            this.instance = new UserService();
        return this.instance;
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
            return yield prisma_1.prisma.user.create({
                data: {
                    email: data.email,
                    name: data.name,
                    address: data.address,
                    password: hashedPassword,
                    role: data.role || client_1.Role.USER,
                },
            });
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.findUnique({
                where: { id },
                include: { stores: true, ratings: true },
            });
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.findUnique({
                where: { email },
            });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.findMany({
                include: { stores: true, ratings: true },
                orderBy: { createdAt: "desc" },
            });
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.password && typeof data.password === "string") {
                data.password = yield bcryptjs_1.default.hash(data.password, 10);
            }
            return yield prisma_1.prisma.user.update({
                where: { id },
                data,
            });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.delete({
                where: { id },
            });
        });
    }
    updateRefreshToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.update({
                where: { id: userId },
                data: { refreshToken },
            });
        });
    }
    validatePassword(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, user.password);
        });
    }
    getUsersByRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.user.findMany({
                where: { role },
            });
        });
    }
}
const userService = UserService.getInstance();
exports.default = userService;
