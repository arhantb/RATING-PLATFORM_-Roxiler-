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
const user_service_1 = __importDefault(require("../service/user.service"));
const error_1 = require("../lib/error");
class UserController {
    constructor() {
        this.getUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_service_1.default.getAllUsers();
                res.json(users);
            }
            catch (error) {
                next(new error_1.InternalServerError("Failed to fetch users"));
            }
        });
        this.getUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!id)
                    throw new error_1.BadRequestError("User id is required");
                const user = yield user_service_1.default.getUserById(id);
                if (!user)
                    throw new error_1.NotFoundError("User not found");
                res.json(user);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!id)
                    throw new error_1.BadRequestError("User id is required");
                const user = yield user_service_1.default.updateUser(id, req.body);
                res.json(user);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Array.isArray(req.params.id)
                    ? req.params.id[0]
                    : req.params.id;
                if (!id)
                    throw new error_1.BadRequestError("User id is required");
                yield user_service_1.default.deleteUser(id);
                res.json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new UserController();
        return this.instance;
    }
}
const userController = UserController.getInstance();
exports.default = userController;
