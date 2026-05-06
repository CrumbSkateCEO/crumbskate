import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean, user?: User, error?: string}>;
  register: (userData: any) => Promise<{success: boolean, user?: User, error?: string}>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
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

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("crumbskate_token", data.token);
      setUser(data.usuario);
      return { success: true, user: data.usuario };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || "Error al iniciar sesión" 
      };
    }
  };

  const register = async (userData: any) => {
    try {
      const { data } = await api.post("/auth/registro", userData);
      localStorage.setItem("crumbskate_token", data.token);
      setUser(data.usuario);
      return { success: true, user: data.usuario };
    } catch (error: any) {
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

