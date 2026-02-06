import React from 'react';
import { useAtomValue } from 'jotai';
import { isAuthenticatedAtom, userAtom } from '../store';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { Role } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', isLoading, className = '', children, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-primary-900 text-white hover:bg-primary-800 focus:ring-primary-900",
    secondary: "bg-primary-100 text-primary-900 hover:bg-primary-200 focus:ring-primary-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    ghost: "bg-transparent text-primary-600 hover:bg-primary-50 hover:text-primary-900",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">
        {label}
      </label>
      <input
        className={`block w-full px-3 py-2 bg-white border ${error ? 'border-red-500 focus:ring-red-500' : 'border-primary-200 focus:border-primary-900 focus:ring-primary-900'} text-sm placeholder-primary-400 focus:outline-none focus:ring-1 transition-shadow ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = useAtomValue(isAuthenticatedAtom);
  const user = useAtomValue(userAtom);
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.hash = '#/login';
  };

  if (!isAuth) {
    return <main className="min-h-screen flex flex-col items-center justify-center p-4">{children}</main>;
  }

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Stores', path: '/stores' },
  ];

  if (user?.role === Role.ADMIN) {
    navItems.push({ label: 'Users', path: '/users' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary-50">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-lg font-bold tracking-tight text-primary-900">RateStore</span>
            <nav className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-primary-900' : 'text-primary-500 hover:text-primary-900'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-right hidden sm:block">
              <p className="font-medium text-primary-900">{user?.name}</p>
              <p className="text-primary-500 capitalize">{user?.role.toLowerCase()}</p>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-xs">
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Nav (Simple) */}
      <div className="md:hidden border-b border-primary-200 bg-white px-4 py-2 flex gap-4 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-xs font-medium whitespace-nowrap ${location.pathname === item.path ? 'text-primary-900 underline' : 'text-primary-500'
              }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

// --- Star Rating ---
export const StarRating: React.FC<{ rating: number; max?: number; onChange?: (r: number) => void; readonly?: boolean }> = ({
  rating, max = 5, onChange, readonly
}) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const val = i + 1;
        const filled = val <= rating;
        return (
          <button
            key={val}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(val)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <svg
              className={`w-5 h-5 ${filled ? 'text-yellow-500' : 'text-primary-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'green' | 'gray' }> = ({ children, color = 'gray' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-emerald-100 text-emerald-800',
    gray: 'bg-primary-100 text-primary-800'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}
