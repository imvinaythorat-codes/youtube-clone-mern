import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("yt_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("yt_user", JSON.stringify(userData));
    localStorage.setItem("yt_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("yt_user");
    localStorage.removeItem("yt_token");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);