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
const auth_service_1 = __importDefault(require("../service/auth.service"));
const error_1 = require("../lib/error");
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
class AuthController {
    constructor() {
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, accessToken, refreshToken } = yield auth_service_1.default.register(req.body);
                res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                res.status(201).json({ user, accessToken });
            }
            catch (error) {
                next(new error_1.BadRequestError(error.message));
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { user, accessToken, refreshToken } = yield auth_service_1.default.login(email, password);
                res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                res.json({ user, accessToken });
            }
            catch (error) {
                next(new error_1.UnauthorizedError(error.message));
            }
        });
        this.refresh = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken)
                    throw new error_1.UnauthorizedError("No refresh token");
                const tokens = yield auth_service_1.default.refresh(refreshToken);
                res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
                res.json({ accessToken: tokens.accessToken });
            }
            catch (error) {
                next(error);
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (userId) {
                    yield auth_service_1.default.logout(userId);
                }
                res.clearCookie("refreshToken", COOKIE_OPTIONS);
                res.json({ success: true });
            }
            catch (error) {
                next(new error_1.InternalServerError("Failed to logout"));
            }
        });
        this.me = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.json({ user: req.user });
            }
            catch (error) {
                next(new error_1.InternalServerError("Failed to fetch user info"));
            }
        });
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthController();
        return this.instance;
    }
}
const authController = AuthController.getInstance();
exports.default = authController;
