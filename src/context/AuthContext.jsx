import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("jobPortalUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("jobPortalToken") || ""
  );

  const [loading, setLoading] = useState(false);

  // Login
  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const receivedToken = response.data.token;
      const receivedUser = response.data.user;

      if (!receivedToken) {
        throw new Error("Token was not received from the server.");
      }

      localStorage.setItem("jobPortalToken", receivedToken);
      setToken(receivedToken);

      if (receivedUser) {
        localStorage.setItem("jobPortalUser", JSON.stringify(receivedUser));
        setUser(receivedUser);
      }

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name, email, password) => {
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      return response.data;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("jobPortalToken");
    localStorage.removeItem("jobPortalUser");

    setToken("");
    setUser(null);
  };

  const value = {
    user,
    setUser,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom authentication hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}