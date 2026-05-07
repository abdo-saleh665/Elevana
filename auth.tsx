import React, { createContext, useContext, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  createId,
  getCurrentUser,
  updateAppState,
  useAppState,
  type LocalUser,
} from "./localStore";

type AuthResult = {
  ok: boolean;
  message?: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type SignupInput = LoginInput & {
  name: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: LocalUser | null;
  login: (input: LoginInput) => AuthResult;
  signup: (input: SignupInput) => AuthResult;
  socialLogin: (provider: "google" | "microsoft" | "apple") => AuthResult;
  resetPassword: (email: string) => AuthResult;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getProviderName = (provider: "google" | "microsoft" | "apple") => {
  return provider.charAt(0).toUpperCase() + provider.slice(1);
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const state = useAppState();
  const user = getCurrentUser(state);

  const login = ({ email, password }: LoginInput): AuthResult => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return { ok: false, message: "Enter your email and password." };
    }

    const matchingUser = state.users.find(
      (item) => normalizeEmail(item.email) === normalizedEmail,
    );

    if (!matchingUser || matchingUser.password !== password) {
      return {
        ok: false,
        message: "No local account matches those credentials.",
      };
    }

    updateAppState((currentState) => ({
      ...currentState,
      sessionUserId: matchingUser.id,
      users: currentState.users.map((item) =>
        item.id === matchingUser.id
          ? { ...item, lastLoginAt: new Date().toISOString() }
          : item,
      ),
    }));

    return { ok: true };
  };

  const signup = ({ name, email, password }: SignupInput): AuthResult => {
    const trimmedName = name.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!trimmedName || !normalizedEmail || !password) {
      return { ok: false, message: "Fill in all required fields." };
    }

    if (password.length < 8) {
      return { ok: false, message: "Password must be at least 8 characters." };
    }

    if (state.users.some((item) => normalizeEmail(item.email) === normalizedEmail)) {
      return { ok: false, message: "A local account already exists for this email." };
    }

    const createdAt = new Date().toISOString();
    const newUser: LocalUser = {
      id: createId("user"),
      name: trimmedName,
      email: normalizedEmail,
      password,
      provider: "email",
      plan: "free",
      createdAt,
      lastLoginAt: createdAt,
    };

    updateAppState((currentState) => ({
      ...currentState,
      users: [...currentState.users, newUser],
      sessionUserId: newUser.id,
    }));

    return { ok: true };
  };

  const socialLogin = (provider: "google" | "microsoft" | "apple"): AuthResult => {
    const providerName = getProviderName(provider);
    const email = `${provider}@local.elevana`;
    const existingUser = state.users.find((item) => item.email === email);
    const createdAt = new Date().toISOString();
    const socialUser: LocalUser = existingUser || {
      id: createId("user"),
      name: `${providerName} Student`,
      email,
      provider,
      plan: "free",
      createdAt,
      lastLoginAt: createdAt,
    };

    updateAppState((currentState) => ({
      ...currentState,
      users: existingUser
        ? currentState.users.map((item) =>
            item.id === existingUser.id
              ? { ...item, lastLoginAt: new Date().toISOString() }
              : item,
          )
        : [...currentState.users, socialUser],
      sessionUserId: socialUser.id,
    }));

    return { ok: true };
  };

  const resetPassword = (email: string): AuthResult => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      return { ok: false, message: "Enter your email before resetting." };
    }

    let didReset = false;

    updateAppState((currentState) => ({
      ...currentState,
      users: currentState.users.map((item) => {
        if (normalizeEmail(item.email) !== normalizedEmail) {
          return item;
        }

        didReset = true;
        return { ...item, password: "password123" };
      }),
    }));

    return didReset
      ? { ok: true, message: "Local password reset to password123." }
      : { ok: false, message: "No local account found for that email." };
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login,
      signup,
      socialLogin,
      resetPassword,
      logout: () => {
        updateAppState((currentState) => ({
          ...currentState,
          sessionUserId: null,
        }));
      },
    }),
    [state.users, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
};
