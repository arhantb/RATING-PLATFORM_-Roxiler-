import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, Input } from "../components/UI";
import { VALIDATION, PASSWORD_REGEX, EMAIL_REGEX } from "../constants";
import { Role } from "../types";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {}
  };

  return (
    <div className="w-full max-w-md bg-white p-8 border border-primary-200 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-primary-900">Sign in</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <span className="text-primary-500">Don't have an account? </span>
        <a
          href="#/register"
          className="font-semibold text-primary-900 hover:underline"
        >
          Register
        </a>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: Role.USER,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (
      formData.name.length < VALIDATION.NAME.MIN ||
      formData.name.length > VALIDATION.NAME.MAX
    ) {
      newErrors.name = `Name must be between ${VALIDATION.NAME.MIN} and ${VALIDATION.NAME.MAX} chars.`;
    }
    if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password =
        "Password must be 8-16 chars, contain 1 uppercase & 1 special char.";
    }
    if (formData.address.length > VALIDATION.ADDRESS.MAX) {
      newErrors.address = `Address max ${VALIDATION.ADDRESS.MAX} chars.`;
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setErrors({ form: "Registration failed. Email might be in use." });
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 border border-primary-200 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-primary-900">
        Create Account
      </h2>
      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm">
          {errors.form}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          error={errors.password}
          placeholder="8-16 chars, 1 Upper, 1 Special"
        />
        <Input
          label="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          error={errors.address}
        />

        <div className="w-full">
          <label className="block text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
            Role
          </label>
          <select
            className="block w-full px-3 py-2 bg-white border border-primary-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary-900"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as Role })
            }
          >
            <option value={Role.USER}>Normal User</option>
            <option value={Role.OWNER}>Store Owner</option>
          </select>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Register
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <span className="text-primary-500">Already have an account? </span>
        <a
          href="#/login"
          className="font-semibold text-primary-900 hover:underline"
        >
          Log in
        </a>
      </div>
    </div>
  );
};
