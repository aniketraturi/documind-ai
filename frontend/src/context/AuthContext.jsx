import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, loginUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const isAuthenticated = Boolean(user);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = async ({ email, password }) => {
    const tokenData = await loginUser({ email, password });

    localStorage.setItem("accessToken", tokenData.access_token);

    const currentUser = await getCurrentUser();
    setUser(currentUser);

    return currentUser;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const value = {
    user,
    initializing,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}