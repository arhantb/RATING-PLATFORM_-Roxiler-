import { Request, Response, NextFunction } from "express";
import storeService from "../service/store.service";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../lib/error";

class StoreController {
  private static instance: StoreController | null;

  static getInstance() {
    if (!this.instance) this.instance = new StoreController();
    return this.instance;
  }

  createStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const store = await storeService.createStore({
        ...req.body,
        userId: req.user!.id,
      });

      res.status(201).json(store);
    } catch (error) {
      next(new BadRequestError((error as Error).message));
    }
  };

  getStores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stores = await storeService.getAllStores();
      res.json(stores);
    } catch (error) {
      next(new InternalServerError("Failed to fetch stores"));
    }
  };

  getStore = async (
    req: Request<{ id: string | string[] }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!id) throw new BadRequestError("Store id is required");

      const store = await storeService.getStoreWithRatings(id);
      if (!store) throw new NotFoundError("Store not found");

      res.json(store);
    } catch (error) {
      next(error);
    }
  };

  getMyStores = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stores = await storeService.getStoresByOwner(req.user!.id);
      res.json(stores);
    } catch (error) {
      next(new InternalServerError("Failed to fetch your stores"));
    }
  };

  updateStore = async (
    req: Request<{ id: string | string[] }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!id) throw new BadRequestError("Store id is required");

      const store = await storeService.updateStore(id, req.body);
      res.json(store);
    } catch (error) {
      next(error);
    }
  };

  deleteStore = async (
    req: Request<{ id: string | string[] }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!id) throw new BadRequestError("Store id is required");

      await storeService.deleteStore(id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}

const storeController = StoreController.getInstance();
export default storeController;
