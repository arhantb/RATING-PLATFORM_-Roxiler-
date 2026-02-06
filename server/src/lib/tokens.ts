import * as jose from "jose";
import { Role } from "../generated/prisma/enums";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET!,
);

export const createToken = async (user: {
  email: string;
  id: string;
  role: Role;
}) => {
  const accessToken = await new jose.SignJWT({
    email: user.email,
    id: user.id,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("60m")
    .sign(JWT_SECRET);

  const refreshToken = await new jose.SignJWT({
    id: user.id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);

  return { accessToken, refreshToken };
};

export const checkToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as {
      email: string;
      id: string;
      role: Role;
      iat: number;
      exp: number;
    };
  } catch {
    return null;
  }
};

export const checkRefreshToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, REFRESH_SECRET);
    return payload as {
      id: string;
      iat: number;
      exp: number;
    };
  } catch {
    return null;
  }
};
