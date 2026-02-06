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
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const auth_service_1 = __importDefault(require("../service/auth.service"));
const error_1 = require("../lib/error");
class AuthMiddleware {
    constructor() {
        this.authenticate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token;
                const authHeader = req.headers.authorization;
                if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                }
                if (!token && ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken)) {
                    token = req.cookies.accessToken;
                }
                if (!token)
                    throw new error_1.UnauthorizedError("No token provided");
                const payload = yield auth_service_1.default.verifyAccessToken(token);
                if (!payload)
                    throw new error_1.UnauthorizedError("Invalid token");
                req.user = {
                    id: payload.id,
                    email: payload.email,
                    role: payload.role,
                };
                next();
            }
            catch (error) {
                next(error);
            }
        });
        this.authorize = (...roles) => {
            return (req, res, next) => {
                if (!req.user || !roles.includes(req.user.role)) {
                    return next(new error_1.ForbiddenError("Forbidden"));
                }
                next();
            };
        };
        this.optionalAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token;
                const authHeader = req.headers.authorization;
                if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                }
                if (!token && ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken)) {
                    token = req.cookies.accessToken;
                }
                if (token) {
                    const payload = yield auth_service_1.default.verifyAccessToken(token);
                    if (payload) {
                        req.user = {
                            id: payload.id,
                            email: payload.email,
                            role: payload.role,
                        };
                    }
                }
                next();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthMiddleware();
        return this.instance;
    }
}
const authMiddleware = AuthMiddleware.getInstance();
exports.authenticate = authMiddleware.authenticate, exports.authorize = authMiddleware.authorize, exports.optionalAuth = authMiddleware.optionalAuth;
exports.default = authMiddleware;
