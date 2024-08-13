import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";

const Dashboard = ({ API }) => {
    const [showForm, setShowForm] = useState(null);
    const [formData, setFormData] = useState({
        accountName: '',
        accountBalance: 0,
    });
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);
    const userId = user?._id; 

    useEffect(() => {
        if (!userId) return; // Prevent fetching if user ID is not available

        const fetchAccounts = async () => {
            try {
                const response = await axios.get(`${API}/api/accounts/${userId}`);
                setAccounts(response.data);
            } catch (err) {
                setError('Failed to fetch accounts');
            }
        };

        fetchAccounts();
    }, [userId, API]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure all required fields are not empty
        if (!formData.accountName.trim() || formData.accountBalance === '') {
            setError('Please provide all required fields.');
            return;
        }

        // Logging data to be sent to backend for debugging
        console.log('Submitting data:', {
            name: formData.accountName,
            balance: formData.accountBalance,
            user: userId
        });

        try {
            const response = await axios.post(`${API}/api/accounts`, {
                name: formData.accountName,
                balance: formData.accountBalance,
                user: userId
            });

            // Update state to include new account
            setAccounts([...accounts, response.data]);

            // Clear form and hide it
            setFormData({ accountName: '', accountBalance: 0 });
            setShowForm(null);
        } catch (err) {
            console.error('Error submitting form:', err.response ? err.response.data : err.message);
            setError('Operation failed!');
        }
    };

    const handleAccountClick = (accountId) => {
        console.log('Account ID:', accountId);
        // Implement navigation or other actions based on the accountId
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
                        <p>Balance: {account.balance}€</p>
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

