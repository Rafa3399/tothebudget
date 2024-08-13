import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//this creates the context (first step)
const AuthContext = createContext();

//this creates the wrapper (second step)
const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();
  useEffect(() => {
    authenticateUser();
  }, []);
  //this function makes an axios call to the /verify route to check the token from the localstorage
  const authenticateUser = async () => {
    try {
      const tokenFromStorage = localStorage.getItem("authToken");
      const { data } = await axios.get("http://localhost:5005/auth/verify", {
        headers: { authorization: `Bearer ${tokenFromStorage}` },
      });
      console.log("verify route successful", data);
      setUser(data);
      setIsLoading(false);
      setIsLoggedIn(true);
    } catch (error) {
      console.log("error verifying the user", error);
      setUser(null);
      setIsLoading(false);
      setIsLoggedIn(false);
    }
  };
  //this function handles logging the user out and navigating to the login page
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    nav("/login");
  };
  return (
    <AuthContext.Provider
      value={{ user, isLoading, isLoggedIn, authenticateUser, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
//always remember to export both
export { AuthContext, AuthWrapper };