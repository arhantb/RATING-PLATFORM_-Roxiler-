import { prisma } from "../lib/prisma";
import { Store, Prisma } from "../generated/prisma/client";

class StoreService {
  private static instance: StoreService | null;

  static getInstance() {
    if (!this.instance) this.instance = new StoreService();
    return this.instance;
  }

  async createStore(data: {
    name: string;
    address: string;
    description?: string;
    userId: string
  }): Promise<Store> {
    return await prisma.store.create({
      data: {
        name: data.name,
        address: data.address,
        description: data.description,
        userId: data.userId,
      },
    });
  }

  async getStoreById(id: string): Promise<Store | null> {
    return await prisma.store.findUnique({
      where: { id },
      include: { owner: true, ratings: true },
    });
  }

  async getAllStores(): Promise<any[]> {
    const stores = await prisma.store.findMany({
      include: { owner: true, ratings: true },
      orderBy: { id: "desc" },
    });

    // Calculate average rating for each store
    return stores.map(store => {
      const averageRating = store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0;

      return {
        ...store,
        averageRating,
      };
    });
  }

  async getStoresByOwner(userId: string): Promise<any[]> {
    const stores = await prisma.store.findMany({
      where: { userId },
      include: { ratings: true },
    });

    // Calculate average rating for each store
    return stores.map(store => {
      const averageRating = store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0;

      return {
        ...store,
        averageRating,
      };
    });
  }

  async updateStore(id: string, data: Prisma.StoreUpdateInput): Promise<Store> {
    return await prisma.store.update({
      where: { id },
      data,
    });
  }

  async deleteStore(id: string): Promise<Store> {
    return await prisma.store.delete({
      where: { id },
    });
  }

  async getStoreWithRatings(id: string): Promise<any | null> {
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        ratings: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
        owner: true,
      },
    });

    if (!store) return null;

    // Calculate average rating
    const averageRating = store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : 0;

    return {
      ...store,
      averageRating,
    };
  }
}

const storeService = StoreService.getInstance();

export default storeService;
