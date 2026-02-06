export const API_BASE_URL = "http://localhost:4000"; // Replace with actual backend URL

export const VALIDATION = {
  NAME: { MIN: 10, MAX: 60 },
  ADDRESS: { MAX: 400 },
  PASSWORD: { MIN: 8, MAX: 16 },
};

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,16}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MENU_ITEMS = [
  { label: "Dashboard", path: "/" },
  { label: "Stores", path: "/stores" },
];
