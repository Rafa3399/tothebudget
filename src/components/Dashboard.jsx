import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import { useNavigate } from 'react-router-dom';
import {API_URL} from '../config.js'

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
    }, [userId, API_URL]);

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
            console.error('Error submitting form:', err.response ? err.response.data : err.message);
            setError('Operation failed!');
        }
    };

    const handleAccountClick = (accountId) => {
        navigate(`/accounts/${accountId}`);
    };

    return (
        <div>
            <h1>Dashboard</h1>
            {error && <p>{error}</p>}

            <h2>Your Accounts</h2>
            {accounts.length > 0 ? (
                accounts.map(account => (
                    <div key={account._id} onClick={() => handleAccountClick(account._id)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                        <h3>{account.name}</h3>
                        <p>Balance: ${account.balance}</p>
                    </div>
                ))
            ) : (
                <p>No accounts available. Please create one.</p>
            )}

            <button onClick={() => setShowForm('account')}>Create New Account</button>

            {showForm === 'account' && (
                <form onSubmit={handleSubmit}>
                    <h2>Create New Account</h2>
                    <input
                        type="text"
                        placeholder="Account Name"
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Account Balance"
                        value={formData.accountBalance}
                        onChange={(e) => setFormData({ ...formData, accountBalance: e.target.value })}
                        required
                    />
                    <button type="submit">Submit</button>
                    <button type="button" onClick={() => setShowForm(null)}>Cancel</button>
                </form>
            )}
        </div>
    );
};

export default Dashboard;
