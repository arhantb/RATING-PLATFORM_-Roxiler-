import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { User } from "./types";

export const tokenAtom = atomWithStorage<string | null>("accessToken", null);
export const userAtom = atomWithStorage<User | null>("user", null);

export const isAuthenticatedAtom = atom(
  (get) => !!get(tokenAtom) && !!get(userAtom),
);

export const isAdminAtom = atom((get) => get(userAtom)?.role === "ADMIN");

export const isOwnerAtom = atom((get) => get(userAtom)?.role === "OWNER");
