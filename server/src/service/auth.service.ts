import userService from "./user.service";
import { createToken, checkRefreshToken, checkToken } from "../lib/tokens";
import { Role } from "../generated/prisma/enums";

class AuthService {
  private static instance: AuthService | null;

  static getInstance() {
    if (!this.instance) this.instance = new AuthService();
    return this.instance;
  }

  async register(data: {
    email: string;
    name: string;
    address: string;
    password: string;
    role?: Role;
  }) {
    const existingUser = await userService.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const user = await userService.createUser(data);
    const tokens = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await userService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await userService.validatePassword(user, password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const tokens = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await userService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    const payload = await checkRefreshToken(refreshToken);
    if (!payload) {
      throw new Error("Invalid refresh token");
    }

    const user = await userService.getUserById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const tokens = await createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await userService.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await userService.updateRefreshToken(userId, null);
    return { success: true };
  }

  async verifyAccessToken(token: string) {
    return await checkToken(token);
  }
}

const authService = AuthService.getInstance();

export default authService;
