import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { API_URL } from "../config.js";

const AccountDetails = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading, isLoggedIn } = useContext(AuthContext);
  const [account, setAccount] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [profits, setProfits] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoading) return; // Wait for the auth state to load
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const accountRes = await axios.get(`${API_URL}/api/accounts/${accountId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccount(accountRes.data);

        const expensesRes = await axios.get(`${API_URL}/api/expenses/account/${accountId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(expensesRes.data);

        const profitsRes = await axios.get(`${API_URL}/api/profits/account/${accountId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfits(profitsRes.data);
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Failed to fetch account details");
      }
    };

    fetchAccountDetails();
  }, [accountId, isLoading, isLoggedIn, navigate]);

  return (
    <div>
      <h1>Account Details</h1>
      {error && <p>{error}</p>}
      {account && (
        <>
          <h2>{account.name}</h2>
          <p>Balance: ${account.balance}</p>
          <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          {/* Rest of the component for displaying expenses and profits */}
        </>
      )}
    </div>
  );
};

export default AccountDetails;
