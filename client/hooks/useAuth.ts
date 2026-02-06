import { useState, useCallback } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../store";
import { api } from "../services/api";
import { User, AuthResponse } from "../types";

interface UseAuthReturn {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const token = useAtomValue(tokenAtom);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.auth.login({ email, password });
        const accessToken = res.accessToken || res.token;

        localStorage.setItem("accessToken", accessToken);
        setToken(accessToken);

        const userResponse = await api.auth.me(accessToken);
        const userData =
          "user" in userResponse ? userResponse.user : userResponse;

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } catch (err: any) {
        setError(err.message || "Login failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setToken, setUser],
  );

  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.auth.register(data);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }, [setToken, setUser]);

  const loadUser = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await api.auth.me(token);
      const userData = "user" in res ? res.user : res;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [token, setUser, logout]);

  return {
    login,
    register,
    logout,
    loadUser,
    isLoading,
    error,
  };
};
