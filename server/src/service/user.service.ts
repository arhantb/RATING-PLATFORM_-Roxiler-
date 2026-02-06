import { prisma } from "../lib/prisma";
import { User, Role, Prisma } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

class UserService {
  private static instance: UserService | null;

  static getInstance() {
    if (!this.instance) this.instance = new UserService();
    return this.instance;
  }

  async createUser(data: {
    email: string;
    name: string;
    address: string;
    password: string;
    role?: Role;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        address: data.address,
        password: hashedPassword,
        role: data.role || Role.USER,
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: { stores: true, ratings: true },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany({
      include: { stores: true, ratings: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    if (data.password && typeof data.password === "string") {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async getUsersByRole(role: Role): Promise<User[]> {
    return await prisma.user.findMany({
      where: { role },
    });
  }
}

const userService = UserService.getInstance();

export default userService;
