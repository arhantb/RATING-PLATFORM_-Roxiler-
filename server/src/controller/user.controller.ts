import { Request, Response, NextFunction } from "express";
import userService from "../service/user.service";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../lib/error";

class UserController {
  private static instance: UserController | null;

  static getInstance() {
    if (!this.instance) this.instance = new UserController();
    return this.instance;
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(new InternalServerError("Failed to fetch users"));
    }
  };

  getUser = async (
    req: Request<{ id: string | string[] }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!id) throw new BadRequestError("User id is required");

      const user = await userService.getUserById(id);
      if (!user) throw new NotFoundError("User not found");

      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: Request<{ id: string | string[] }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!id) throw new BadRequestError("User id is required");

      const user = await userService.updateUser(id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (
    req: Request<{ id: string | string[] }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!id) throw new BadRequestError("User id is required");

      await userService.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}

const userController = UserController.getInstance();
export default userController;
