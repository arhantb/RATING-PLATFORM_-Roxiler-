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
class RatingService {
    static getInstance() {
        if (!this.instance)
            this.instance = new RatingService();
        return this.instance;
    }
    createRating(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.rating.create({
                data: {
                    rating: data.rating,
                    userId: data.userId,
                    storeId: data.storeId,
                    createdAt: new Date(),
                },
            });
        });
    }
    getRatingById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.rating.findUnique({
                where: { id },
                include: { user: true, store: true },
            });
        });
    }
    getRatingsByStore(storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.rating.findMany({
                where: { storeId },
                include: { user: true },
                orderBy: { createdAt: "desc" },
            });
        });
    }
    getRatingsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.rating.findMany({
                where: { userId },
                include: { store: true },
                orderBy: { createdAt: "desc" },
            });
        });
    }
    updateRating(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.rating.update({
                where: { id },
                data,
            });
        });
    }
    deleteRating(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.rating.delete({
                where: { id },
            });
        });
    }
    getAverageRating(storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma_1.prisma.rating.aggregate({
                where: { storeId },
                _avg: { rating: true },
            });
            return result._avg.rating || 0;
        });
    }
    hasUserRated(userId, storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield prisma_1.prisma.rating.count({
                where: { userId, storeId },
            });
            return count > 0;
        });
    }
}
const ratingService = RatingService.getInstance();
exports.default = ratingService;
