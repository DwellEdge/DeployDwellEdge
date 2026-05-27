import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 📝 REGISTER
  const register = async (email, password, firstName, lastName) => {
    setError(null);
    try {
      const response = await api.post("/api/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, error: message };
    }
  };

  // 🔐 LOGIN
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await api.post("/api/auth/login", { email, password });

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, error: message };
    }
  };

  // 🔄 CHANGE PASSWORD
  const changePassword = async (email, currentPassword, newPassword) => {
    setError(null);
    try {
      await api.post("/api/auth/change-password", {
        email,
        currentPassword,
        newPassword,
      });

      return { success: true, message: "Password updated" };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      return { success: false, error: message };
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    changePassword,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
