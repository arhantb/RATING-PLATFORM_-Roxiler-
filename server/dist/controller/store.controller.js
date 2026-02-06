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
const store_service_1 = __importDefault(require("../service/store.service"));
const error_1 = require("../lib/error");
class StoreController {
    constructor() {
        this.createStore = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const store = yield store_service_1.default.createStore(Object.assign(Object.assign({}, req.body), { userId: req.user.id }));
                res.status(201).json(store);
            }
            catch (error) {
                next(new error_1.BadRequestError(error.message));
            }
        });
        this.getStores = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const stores = yield store_service_1.default.getAllStores();
                res.json(stores);
            }
            catch (error) {
                next(new error_1.InternalServerError("Failed to fetch stores"));
            }
        });
        this.getStore = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!id)
                    throw new error_1.BadRequestError("Store id is required");
                const store = yield store_service_1.default.getStoreWithRatings(id);
                if (!store)
                    throw new error_1.NotFoundError("Store not found");
                res.json(store);
            }
            catch (error) {
                next(error);
            }
        });
        this.getMyStores = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const stores = yield store_service_1.default.getStoresByOwner(req.user.id);
                res.json(stores);
            }
            catch (error) {
                next(new error_1.InternalServerError("Failed to fetch your stores"));
            }
        });
        this.updateStore = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!id)
                    throw new error_1.BadRequestError("Store id is required");
                const store = yield store_service_1.default.updateStore(id, req.body);
                res.json(store);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteStore = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!id)
                    throw new error_1.BadRequestError("Store id is required");
                yield store_service_1.default.deleteStore(id);
                res.json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new StoreController();
        return this.instance;
    }
}
const storeController = StoreController.getInstance();
exports.default = storeController;
