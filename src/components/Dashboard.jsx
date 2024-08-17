// /components/Dashboard.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../config.js';

const Dashboard = () => {
    const [showForm, setShowForm] = useState(null);
    const [formData, setFormData] = useState({
        accountName: '',
        accountBalance: 0,
    });
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState('');
    const [editingAccountId, setEditingAccountId] = useState(null);

    const { user } = useContext(AuthContext);
    const userId = user?._id;
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;

        const fetchAccounts = async () => {
            try {
                const token = localStorage.getItem("authToken"); 
                if (!token) {
                    setError('Authentication token not found.');
                    return;
                }
                const response = await axios.get(`${API_URL}/api/accounts/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAccounts(response.data);
            } catch (err) {
                setError('Failed to fetch accounts');
                console.error(err);
            }
        }

        fetchAccounts();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.accountName.trim()) {
            setError('Please provide an account name.');
            return;
        }

        try {
            const token = localStorage.getItem("authToken"); 
            if (editingAccountId) {
                await axios.put(`${API_URL}/api/accounts/${editingAccountId}`, {
                    name: formData.accountName,
                    balance: formData.accountBalance,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setAccounts(accounts.map(account =>
                    account._id === editingAccountId
                        ? { ...account, name: formData.accountName }
                        : account
                ));
            } else {
                const response = await axios.post(`${API_URL}/api/accounts`, {
                    name: formData.accountName,
                    balance: formData.accountBalance,
                    user: userId
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setAccounts([...accounts, response.data]);
            }

            setFormData({ accountName: '', accountBalance: 0 });
            setShowForm(null);
            setEditingAccountId(null);
        } catch (err) {
            setError('Operation failed!');
            console.error("Error submitting form:", err);
        }
    };

    const handleEdit = (account) => {
        setFormData({
            accountName: account.name,
            accountBalance: account.balance,
        });
        setEditingAccountId(account._id);
        setShowForm('account');
    }

    const handleDelete = async (accountId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this account? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`${API_URL}/api/accounts/${accountId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(accounts.filter(account => account._id !== accountId));
        } catch (err) {
            setError('Failed to delete account');
            console.error("Error deleting account:", err);
        }
    };

    const handleAccountClick = (accountId) => {
        navigate(`/accounts/${accountId}`);
    }

    return (
        <div className="container">
            <h1>Welcome, {user?.name}!</h1>

            <div className="accounts-section">
                <fieldset>
                    <legend>Accounts</legend>
                    {accounts.length > 0 ? (
                        accounts.map(account => (
                            <div key={account._id} className="account-card">
                                <h3 onClick={() => handleAccountClick(account._id)}>{account.name}</h3>
                                <p>Balance: {account.balance}€</p>
                                <div className="account-actions">
                                    <button onClick={() => handleEdit(account)} className="action-btn">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDelete(account._id)} className="action-btn">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No accounts yet. Please add one!</p>
                    )}
                    <button onClick={() => setShowForm('account')} className="add-account-btn">Add Account</button>
                </fieldset>

                {showForm === 'account' && (
                    <form onSubmit={handleSubmit} className="account-form">
                        <input
                            type="text"
                            name="accountName"
                            value={formData.accountName}
                            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                            placeholder="Account Name"
                        />
                        {/* Hide or disable the balance input during editing */}
                        {editingAccountId === null && (
                            <input
                                type="number"
                                name="accountBalance"
                                value={formData.accountBalance}
                                onChange={(e) => setFormData({ ...formData, accountBalance: parseFloat(e.target.value) })}
                                placeholder="Starting Balance"
                            />
                        )}
                        <button type="submit">{editingAccountId ? 'Update Account' : 'Add Account'}</button>
                        <button type="button" onClick={() => setShowForm(null)} className="cancel-btn">Cancel</button>
                    </form>
                )}
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Dashboard;
