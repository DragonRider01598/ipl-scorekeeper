import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Function to verify authentication
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsAdmin(false);
      return;
    }

    try {
      const { data } = await axios.get("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(data.user);
      setIsAdmin(data.user.role === "admin");
    } catch (error) {
      console.error("Auth check failed", error);
      localStorage.removeItem("token");
      setUser(null);
      setIsAdmin(false);
    }
  };

  // Check auth status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      setUser({ username: data.username, role: data.role });
      setIsAdmin(data.role === "admin");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};