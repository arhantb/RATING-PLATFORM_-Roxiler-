import { Router } from "express";
import authController from "../controller/auth.controller";
import userController from "../controller/user.controller";
import storeController from "../controller/store.controller";
import ratingController from "../controller/rating.controller";
import { authenticate, authorize } from "../middlwares/auth";
import { Role } from "../generated/prisma/enums";

const router = Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/refresh", authController.refresh);
router.post("/auth/logout", authenticate, authController.logout);
router.get("/auth/me", authenticate, authController.me);

router.get(
  "/users",
  authenticate,
  authorize(Role.ADMIN),
  userController.getUsers,
);
router.get("/users/:id", authenticate, userController.getUser);
router.put("/users/:id", authenticate, userController.updateUser);
router.delete(
  "/users/:id",
  authenticate,
  authorize(Role.ADMIN),
  userController.deleteUser,
);

router.post("/stores", authenticate, storeController.createStore);
router.get("/stores", storeController.getStores);
router.get("/stores/:id", storeController.getStore);
router.get("/my-stores", authenticate, storeController.getMyStores);
router.put("/stores/:id", authenticate, storeController.updateStore);
router.delete("/stores/:id", authenticate, storeController.deleteStore);

router.post("/ratings", authenticate, ratingController.createRating);
router.get("/ratings/store/:storeId", ratingController.getStoreRatings);
router.get("/ratings/me", authenticate, ratingController.getMyRatings);
router.put("/ratings/:id", authenticate, ratingController.updateRating);
router.delete("/ratings/:id", authenticate, ratingController.deleteRating);

export default router;
