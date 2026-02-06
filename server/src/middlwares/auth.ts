import { Request, Response, NextFunction } from "express";
import authService from "../service/auth.service";
import { Role } from "../generated/prisma/enums";
import { UnauthorizedError, ForbiddenError } from "../lib/error";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

class AuthMiddleware {
  private static instance: AuthMiddleware | null;

  static getInstance() {
    if (!this.instance) this.instance = new AuthMiddleware();
    return this.instance;
  }

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }

      if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      }

      if (!token) throw new UnauthorizedError("No token provided");

      const payload = await authService.verifyAccessToken(token);
      if (!payload) throw new UnauthorizedError("Invalid token");

      req.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

  authorize = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(new ForbiddenError("Forbidden"));
      }
      next();
    };
  };

  optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }

      if (!token && req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      }

      if (token) {
        const payload = await authService.verifyAccessToken(token);
        if (payload) {
          req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
          };
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

const authMiddleware = AuthMiddleware.getInstance();

export const { authenticate, authorize, optionalAuth } = authMiddleware;
export default authMiddleware;
