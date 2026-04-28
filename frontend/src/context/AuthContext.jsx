import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("crumbskate_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("crumbskate_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("crumbskate_user");
    }
  }, [user]);

  const login = (email, password) => {
    // Admin check
    if (email === "user@root.crumb" && password === "amigotenesmiga") {
      const adminUser = { email, role: "admin", name: "Admin Crumbskate" };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }
    
    // Default user mock
    const regularUser = { email, role: "user", name: email.split('@')[0] };
    setUser(regularUser);
    return { success: true, user: regularUser };
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
