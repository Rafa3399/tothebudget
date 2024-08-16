// context/auth.context.jsx
import axios from "axios"
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from '../config.js'

const AuthContext = createContext()

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    authenticateUser()
  }, [])


  const authenticateUser = async () => {
    try {
      const tokenFromStorage = localStorage.getItem("authToken");
      if (tokenFromStorage) {
        const { data } = await axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${tokenFromStorage}` },
        });
        setUser(data)
        setIsLoggedIn(true)
      } else {
        throw new Error("No token found");
      }
    } catch (error) {
      console.log("Error verifying the user", error)
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false)
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    setUser(null)
    setIsLoggedIn(false)
    navigate("/login")
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { authToken } = response.data 
      localStorage.setItem("authToken", authToken) 
      await authenticateUser() 
      navigate("/dashboard") 
    } catch (err) {
      console.error("Login failed:", err)
      throw new Error("Login failed!")
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isLoggedIn, authenticateUser, handleLogout, handleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthWrapper }