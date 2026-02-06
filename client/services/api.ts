import { API_BASE_URL } from "../constants";
import { User, Store, Rating, AuthResponse } from "../types";

const getHeaders = (token: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const request = async <T>(
  endpoint: string,
  method: string,
  token: string | null,
  body?: unknown,
): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: getHeaders(token),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network request failed");
  }
};

export const api = {
  auth: {
    login: (data: { email: string; password: string }) =>
      request<AuthResponse>("/auth/login", "POST", null, data),
    register: (data: Partial<User> & { password: string }) =>
      request<void>("/auth/register", "POST", null, data),
    me: (token: string) =>
      request<{ user: User } | User>("/auth/me", "GET", token),
    logout: (token: string) =>
      request<void>("/auth/logout", "POST", token),
  },
  users: {
    getAll: (token: string) =>
      request<User[]>("/users", "GET", token),
    update: (token: string, id: string, data: Partial<User>) =>
      request<User>(`/users/${id}`, "PUT", token, data),
    delete: (token: string, id: string) =>
      request<void>(`/users/${id}`, "DELETE", token),
  },
  stores: {
    create: (token: string, data: Partial<Store>) =>
      request<Store>("/stores", "POST", token, data),
    getAll: (token: string | null) =>
      request<Store[]>("/stores", "GET", token),
    getOne: (token: string | null, id: string) =>
      request<Store>(`/stores/${id}`, "GET", token),
    getMyStores: (token: string) =>
      request<Store[]>("/my-stores", "GET", token),
    update: (token: string, id: string, data: Partial<Store>) =>
      request<Store>(`/stores/${id}`, "PUT", token, data),
    delete: (token: string, id: string) =>
      request<void>(`/stores/${id}`, "DELETE", token),
  },
  ratings: {
    create: (token: string, data: Partial<Rating>) =>
      request<Rating>("/ratings", "POST", token, data),
    getByStore: (token: string | null, storeId: string) =>
      request<Rating[]>(`/ratings/store/${storeId}`, "GET", token),
    getMyRatings: (token: string) =>
      request<Rating[]>("/ratings/me", "GET", token),
    update: (token: string, id: string, data: Partial<Rating>) =>
      request<Rating>(`/ratings/${id}`, "PUT", token, data),
    delete: (token: string, id: string) =>
      request<void>(`/ratings/${id}`, "DELETE", token),
  },
};
