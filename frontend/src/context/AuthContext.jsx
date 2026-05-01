import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("crumbskate_token");
      if (token) {
        try {
          const { data } = await api.get("/auth/perfil");
          setUser(data);
        } catch (error) {
          console.error("Error validando token:", error);
          localStorage.removeItem("crumbskate_token");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("crumbskate_token", data.token);
      setUser(data.usuario);
      return { success: true, user: data.usuario };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Error al iniciar sesión" 
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post("/auth/registro", userData);
      localStorage.setItem("crumbskate_token", data.token);
      setUser(data.usuario);
      return { success: true, user: data.usuario };
    } catch (error) {
       return { 
        success: false, 
        error: error.response?.data?.errors?.[0]?.msg || error.response?.data?.error || "Error al registrarse" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("crumbskate_token");
    setUser(null);
  };

  const isAdmin = user?.rol === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

