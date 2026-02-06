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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
class StoreService {
    static getInstance() {
        if (!this.instance)
            this.instance = new StoreService();
        return this.instance;
    }
    createStore(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.store.create({
                data: {
                    name: data.name,
                    userId: data.userId,
                },
            });
        });
    }
    getStoreById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.store.findUnique({
                where: { id },
                include: { owner: true, ratings: true },
            });
        });
    }
    getAllStores() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.store.findMany({
                include: { owner: true, ratings: true },
                orderBy: { id: "desc" },
            });
        });
    }
    getStoresByOwner(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.store.findMany({
                where: { userId },
                include: { ratings: true },
            });
        });
    }
    updateStore(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.store.update({
                where: { id },
                data,
            });
        });
    }
    deleteStore(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.store.delete({
                where: { id },
            });
        });
    }
    getStoreWithRatings(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.store.findUnique({
                where: { id },
                include: {
                    ratings: {
                        include: { user: true },
                        orderBy: { createdAt: "desc" },
                    },
                    owner: true,
                },
            });
        });
    }
}
const storeService = StoreService.getInstance();
exports.default = storeService;
