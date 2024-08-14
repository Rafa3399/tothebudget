import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config.js';

const Dashboard = () => {
    const [showForm, setShowForm] = useState(null);
    const [formData, setFormData] = useState({
        accountName: '',
        accountBalance: 0,
    });
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);
    const userId = user?._id; 
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;

        const fetchAccounts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/accounts/${userId}`);
                setAccounts(response.data);
            } catch (err) {
                setError('Failed to fetch accounts');
            }
        };

        fetchAccounts();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.accountName.trim() || formData.accountBalance === '') {
            setError('Please provide all required fields.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/api/accounts`, {
                name: formData.accountName,
                balance: formData.accountBalance,
                user: userId
            });

            setAccounts([...accounts, response.data]);
            setFormData({ accountName: '', accountBalance: 0 });
            setShowForm(null);
        } catch (err) {
            setError('Operation failed!');
        }
    };

    const handleAccountClick = (accountId) => {
        navigate(`/accounts/${accountId}`);
    };

    return (
        <div className="container">
            <h1>Welcome, {user?.name}!</h1>

            <fieldset>
                <legend>Accounts</legend>
                {accounts.length > 0 ? (
                    accounts.map(account => (
                        <div key={account._id} className="account-card" onClick={() => handleAccountClick(account._id)}>
                            <h3>{account.name}</h3>
                            <p>Balance: ${account.balance}</p>
                        </div>
                    ))
                ) : (
                    <p>No accounts yet. Please add one!</p>
                )}
                <button onClick={() => setShowForm('account')}>Add Account</button>
            </fieldset>

            {showForm === 'account' && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="accountName"
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        placeholder="Account Name"
                    />
                    <input
                        type="number"
                        name="accountBalance"
                        value={formData.accountBalance}
                        onChange={(e) => setFormData({ ...formData, accountBalance: parseFloat(e.target.value) })}
                        placeholder="Starting Balance"
                    />
                    <button type="submit">Add Account</button>
                    <button type="button" onClick={() => setShowForm(null)}>Cancel</button>
                </form>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Dashboard;
