import { Request, Response, NextFunction } from "express";
import ratingService from "../service/rating.service";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../lib/error";

class RatingController {
  private static instance: RatingController | null;

  static getInstance() {
    if (!this.instance) this.instance = new RatingController();
    return this.instance;
  }

  createRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { storeId, rating } = req.body;

      if (!storeId) throw new BadRequestError("storeId is required");
      if (rating === undefined || rating === null) throw new BadRequestError("rating is required");

      const existing = await ratingService.hasUserRated(req.user!.id, storeId);
      if (existing) {
        throw new BadRequestError("Already rated this store");
      }

      const newRating = await ratingService.createRating({
        rating,
        userId: req.user!.id,
        storeId,
      });

      res.status(201).json(newRating);
    } catch (error) {
      next(error);
    }
  };

  getStoreRatings = async (
    req: Request<{ storeId: string | string[] }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // Handle string | string[]
      const storeId = Array.isArray(req.params.storeId)
        ? req.params.storeId[0]
        : req.params.storeId;

      if (!storeId) throw new BadRequestError("storeId is required");

      const ratings = await ratingService.getRatingsByStore(storeId);
      if (!ratings) throw new NotFoundError("No ratings found for this store");

      const average = await ratingService.getAverageRating(storeId);

      res.json({ ratings, average });
    } catch (error) {
      next(error);
    }
  };

  getMyRatings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ratings = await ratingService.getRatingsByUser(req.user!.id);
      res.json(ratings);
    } catch (error) {
      next(new InternalServerError("Failed to fetch your ratings"));
    }
  };

  updateRating = async (
    req: Request<{ id: string | string[] }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!id) throw new BadRequestError("Rating id is required");

      const rating = await ratingService.updateRating(id, req.body);
      res.json(rating);
    } catch (error) {
      next(error);
    }
  };

  deleteRating = async (
    req: Request<{ id: string | string[] }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      if (!id) throw new BadRequestError("Rating id is required");

      await ratingService.deleteRating(id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}

const ratingController = RatingController.getInstance();
export default ratingController;
