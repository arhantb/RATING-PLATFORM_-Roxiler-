import { Request, Response, NextFunction } from "express";
import authService from "../service/auth.service";
import {
  BadRequestError,
  UnauthorizedError,
  InternalServerError,
} from "../lib/error";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

class AuthController {
  private static instance: AuthController | null;

  static getInstance() {
    if (!this.instance) this.instance = new AuthController();
    return this.instance;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken, refreshToken } = await authService.register(
        req.body,
      );
      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.status(201).json({ user, accessToken });
    } catch (error) {
      next(new BadRequestError((error as Error).message));
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.login(
        email,
        password,
      );
      res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
      res.json({ user, accessToken });
    } catch (error) {
      next(new UnauthorizedError((error as Error).message));
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new UnauthorizedError("No refresh token");

      const tokens = await authService.refresh(refreshToken);
      res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS);
      res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (userId) {
        await authService.logout(userId);
      }
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      res.json({ success: true });
    } catch (error) {
      next(new InternalServerError("Failed to logout"));
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({ user: req.user });
    } catch (error) {
      next(new InternalServerError("Failed to fetch user info"));
    }
  };
}

const authController = AuthController.getInstance();
export default authController;
