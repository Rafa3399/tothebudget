import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/auth.context";
import axios from 'axios';

const AccountDetails = ({ API }) => {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useContext(AuthContext);
    const [account, setAccount] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [profits, setProfits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        expenseAmount: '',
        expenseCategory: '',
        expenseDescription: '',
        profitAmount: '',
        profitCategory: '',
        profitDescription: ''
    });
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [showProfitForm, setShowProfitForm] = useState(false);
    const [error, setError] = useState('');
  

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
            return;
        }

        const fetchAccountDetails = async () => {
            try {
                const response = await axios.get(`${API}/api/accounts/${accountId}`);
                setAccount(response.data);
                console.log(response.data)
            } catch (err) {
                setError('Failed to fetch account details');
            }
        };

        const fetchExpensesAndProfits = async () => {
            try {
                const [expensesResponse, profitsResponse] = await Promise.all([
                    axios.get(`${API}/api/expenses/account/${accountId}`),
                    axios.get(`${API}/api/profits/account/${accountId}`)
                ]);
                setExpenses(expensesResponse.data);
                setProfits(profitsResponse.data);
            } catch (err) {
                setError('Failed to fetch expenses or profits');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API}/api/expense-categories`);
                setCategories(response.data);
            } catch (err) {
                setError('Failed to fetch categories');
            }
        };

        fetchAccountDetails();
        fetchExpensesAndProfits();
        fetchCategories();
    }, [accountId, isLoggedIn, navigate, API]);

    const handleSubmit = async (e, type) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");
            const url = `${API}/api/${type}`;
            const data = {
                amount: type.includes('expenses') ? formData.expenseAmount : formData.profitAmount,
                category: type.includes('expenses') ? formData.expenseCategory : formData.profitCategory,
                description: type.includes('expenses') ? formData.expenseDescription : formData.profitDescription,
                account: accountId,
                date: new Date()
            };

            if (!data.amount || !data.category) {
                throw new Error('Amount and category are required');
            }

            const response = await axios.post(url, data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (type.includes('expenses')) {
                setExpenses(prevExpenses => [...prevExpenses, response.data]);
            } else if (type.includes('profits')) {
                setProfits(prevProfits => [...prevProfits, response.data]);
            }

            setFormData({
                expenseAmount: '',
                expenseCategory: '',
                expenseDescription: '',
                profitAmount: '',
                profitCategory: '',
                profitDescription: ''
            });

            if (type.includes('expenses')) setShowExpenseForm(false);
            if (type.includes('profits')) setShowProfitForm(false);
        } catch (err) {
            console.error('Error submitting form:', err.response ? err.response.data : err.message);
            setError('Operation failed. Please try again.');
        }
    };

    return (
        <div>
            <h1>Account Details</h1>
            {error && <p>{error}</p>}

            {account && (
                <>
                    <h2>{account.name}</h2>
                    <p>Balance: ${account.balance}</p>
                    <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>

                    <h3>Expenses</h3>
                    {expenses.length > 0 ? (
                        expenses.map(expense => (
                            <div key={expense._id}>
                                <p>Amount: ${expense.amount}</p>
                                <p>Category: {expense.category.name}</p>
                                <p>Description: {expense.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>No expenses available.</p>
                    )}
                    <button onClick={() => setShowExpenseForm(true)}>Add New Expense</button>
                    {showExpenseForm && (
                        <form onSubmit={(e) => handleSubmit(e, 'expenses')}>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={formData.expenseAmount}
                                onChange={(e) => setFormData({ ...formData, expenseAmount: e.target.value })}
                                required
                            />
                            <select
                                value={formData.expenseCategory}
                                onChange={(e) => setFormData({ ...formData, expenseCategory: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Description"
                                value={formData.expenseDescription}
                                onChange={(e) => setFormData({ ...formData, expenseDescription: e.target.value })}
                            />
                            <button type="submit">Add Expense</button>
                            <button type="button" onClick={() => setShowExpenseForm(false)}>Cancel</button>
                        </form>
                    )}

                    <h3>Profits</h3>
                    {profits.length > 0 ? (
                        profits.map(profit => (
                            <div key={profit._id}>
                                <p>Amount: ${profit.amount}</p>
                                <p>Category: {profit.category.name}</p>
                                <p>Description: {profit.description}</p>
                            </div>
                        ))
                    ) : (
                        <p>No profits available.</p>
                    )}
                    <button onClick={() => setShowProfitForm(true)}>Add New Profit</button>
                    {showProfitForm && (
                        <form onSubmit={(e) => handleSubmit(e, 'profits')}>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={formData.profitAmount}
                                onChange={(e) => setFormData({ ...formData, profitAmount: e.target.value })}
                                required
                            />
                            <select
                                value={formData.profitCategory}
                                onChange={(e) => setFormData({ ...formData, profitCategory: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Description"
                                value={formData.profitDescription}
                                onChange={(e) => setFormData({ ...formData, profitDescription: e.target.value })}
                            />
                            <button type="submit">Add Profit</button>
                            <button type="button" onClick={() => setShowProfitForm(false)}>Cancel</button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
};

export default AccountDetails;
