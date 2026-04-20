import { createContext, useContext, useState, useEffect } from "react";

// Create Context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ LOGIN (token + role)
  const login = (data) => {
    // data = { token, role }
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    setUser({
      token: data.token,
      role: data.role,
    });
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  // ✅ AUTO LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setUser({ token, role });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  return useContext(AuthContext);
};