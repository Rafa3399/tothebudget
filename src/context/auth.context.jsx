import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config.js';

// Create the context
const AuthContext = createContext();

// Create the provider
const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    authenticateUser();
  }, []);

  // Function to authenticate user
  const authenticateUser = async () => {
    try {
      const tokenFromStorage = localStorage.getItem("authToken");
      if (tokenFromStorage) {
        const { data } = await axios.get(`${API_URL}/auth/verify`, {
          headers: { authorization: `Bearer ${tokenFromStorage}` },
        });
        console.log("verify route successful", data);
        setUser(data);
        setIsLoggedIn(true);
      } else {
        throw new Error("No token found");
      }
    } catch (error) {
      console.log("error verifying the user", error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null); // Clear user state
    setIsLoggedIn(false); // Update logged-in status
    nav("/login"); // Navigate to login page
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isLoggedIn, authenticateUser, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthWrapper };
