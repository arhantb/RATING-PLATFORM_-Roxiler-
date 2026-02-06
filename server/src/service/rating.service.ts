import { PrismaClient, Rating, Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

class RatingService {
  private static instance: RatingService | null;

  static getInstance() {
    if (!this.instance) this.instance = new RatingService();
    return this.instance;
  }

  async createRating(data: {
    rating: number;
    userId: string;
    storeId: string;
  }): Promise<Rating> {
    return await prisma.rating.create({
      data: {
        rating: data.rating,
        userId: data.userId,
        storeId: data.storeId,
        createdAt: new Date(),
      },
    });
  }

  async getRatingById(id: string): Promise<Rating | null> {
    return await prisma.rating.findUnique({
      where: { id },
      include: { user: true, store: true },
    });
  }

  async getRatingsByStore(storeId: string): Promise<Rating[]> {
    return await prisma.rating.findMany({
      where: { storeId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    return await prisma.rating.findMany({
      where: { userId },
      include: { store: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateRating(
    id: string,
    data: Prisma.RatingUpdateInput,
  ): Promise<Rating> {
    return await prisma.rating.update({
      where: { id },
      data,
    });
  }

  async deleteRating(id: string): Promise<Rating> {
    return await prisma.rating.delete({
      where: { id },
    });
  }

  async getAverageRating(storeId: string): Promise<number> {
    const result = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { rating: true },
    });
    return result._avg.rating || 0;
  }

  async hasUserRated(userId: string, storeId: string): Promise<boolean> {
    const count = await prisma.rating.count({
      where: { userId, storeId },
    });
    return count > 0;
  }
}

const ratingService = RatingService.getInstance();

export default ratingService;
