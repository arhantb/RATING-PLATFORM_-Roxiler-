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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rating_service_1 = __importDefault(require("../service/rating.service"));
const error_1 = require("../lib/error");
class RatingController {
    constructor() {
        this.createRating = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { storeId } = _a, rest = __rest(_a, ["storeId"]);
                if (!storeId)
                    throw new error_1.BadRequestError("storeId is required");
                const existing = yield rating_service_1.default.hasUserRated(req.user.id, storeId);
                if (existing) {
                    throw new error_1.BadRequestError("Already rated this store");
                }
                const rating = yield rating_service_1.default.createRating(Object.assign(Object.assign({}, rest), { userId: req.user.id, storeId }));
                res.status(201).json(rating);
            }
            catch (error) {
                next(error);
            }
        });
        this.getStoreRatings = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Handle string | string[]
                const storeId = Array.isArray(req.params.storeId)
                    ? req.params.storeId[0]
                    : req.params.storeId;
                if (!storeId)
                    throw new error_1.BadRequestError("storeId is required");
                const ratings = yield rating_service_1.default.getRatingsByStore(storeId);
                if (!ratings)
                    throw new error_1.NotFoundError("No ratings found for this store");
                const average = yield rating_service_1.default.getAverageRating(storeId);
                res.json({ ratings, average });
            }
            catch (error) {
                next(error);
            }
        });
        this.getMyRatings = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ratings = yield rating_service_1.default.getRatingsByUser(req.user.id);
                res.json(ratings);
            }
            catch (error) {
                next(new error_1.InternalServerError("Failed to fetch your ratings"));
            }
        });
        this.updateRating = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!id)
                    throw new error_1.BadRequestError("Rating id is required");
                const rating = yield rating_service_1.default.updateRating(id, req.body);
                res.json(rating);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteRating = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!id)
                    throw new error_1.BadRequestError("Rating id is required");
                yield rating_service_1.default.deleteRating(id);
                res.json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new RatingController();
        return this.instance;
    }
}
const ratingController = RatingController.getInstance();
exports.default = ratingController;
