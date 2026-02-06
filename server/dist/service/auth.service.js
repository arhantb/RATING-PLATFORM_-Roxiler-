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
const user_service_1 = __importDefault(require("./user.service"));
const tokens_1 = require("../lib/tokens");
class AuthService {
    static getInstance() {
        if (!this.instance)
            this.instance = new AuthService();
        return this.instance;
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield user_service_1.default.getUserByEmail(data.email);
            if (existingUser) {
                throw new Error("Email already exists");
            }
            const user = yield user_service_1.default.createUser(data);
            const tokens = yield (0, tokens_1.createToken)({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            yield user_service_1.default.updateRefreshToken(user.id, tokens.refreshToken);
            return Object.assign({ user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                } }, tokens);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_service_1.default.getUserByEmail(email);
            if (!user) {
                throw new Error("Invalid credentials");
            }
            const isValid = yield user_service_1.default.validatePassword(user, password);
            if (!isValid) {
                throw new Error("Invalid credentials");
            }
            const tokens = yield (0, tokens_1.createToken)({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            yield user_service_1.default.updateRefreshToken(user.id, tokens.refreshToken);
            return Object.assign({ user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                } }, tokens);
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield (0, tokens_1.checkRefreshToken)(refreshToken);
            if (!payload) {
                throw new Error("Invalid refresh token");
            }
            const user = yield user_service_1.default.getUserById(payload.id);
            if (!user || user.refreshToken !== refreshToken) {
                throw new Error("Invalid refresh token");
            }
            const tokens = yield (0, tokens_1.createToken)({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            yield user_service_1.default.updateRefreshToken(user.id, tokens.refreshToken);
            return tokens;
        });
    }
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_service_1.default.updateRefreshToken(userId, null);
            return { success: true };
        });
    }
    verifyAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, tokens_1.checkToken)(token);
        });
    }
}
const authService = AuthService.getInstance();
exports.default = authService;
