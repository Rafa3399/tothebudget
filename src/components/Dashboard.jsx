import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({API}) => {
    const [data, setData] = useState({
        accounts: [],
        expenses: [],
        profits: [],
        recurringExpenses: [],
        expenseCategories: [],
        profitCategories: []
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const fetchData = async () => {
                try {
                    const userId = 'your_user_id';
                    const [accounts, expenses, profits, recurringExpenses, expenseCategories, profitCategories] = await Promise.all([
                        axios.get(`${API}/api/accounts/${userId}`),
                        axios.get(`${API}/api/expenses/${userId}`),
                        axios.get(`${API}/api/profits/${userId}`),
                        axios.get(`${API}/api/recurring-expenses/${userId}`),
                        axios.get(`${API}/api/expense-categories/${userId}`),
                        axios.get(`${API}/api/profit-categories/${userId}`)
                    ]);
                    setData({
                        accounts: accounts.data,
                        expenses: expenses.data,
                        profits: profits.data,
                        recurringExpenses: recurringExpenses.data,
                        expenseCategories: expenseCategories.data,
                        profitCategories: profitCategories.data
                    });
                } catch (err) {
                    console.error('Error fetching data', err);
                }
            };

            fetchData();
        }
    }, [token]);

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>Accounts</h2>
            <ul>
                {data.accounts.map(account => (
                    <li key={account._id}>{account.name}: ${account.balance}</li>
                ))}
            </ul>
            <h2>Expenses</h2>
            <ul>
                {data.expenses.map(expense => (
                    <li key={expense._id}>{expense.description}: ${expense.amount}</li>
                ))}
            </ul>
            <h2>Profits</h2>
            <ul>
                {data.profits.map(profit => (
                    <li key={profit._id}>{profit.description}: ${profit.amount}</li>
                ))}
            </ul>
            <h2>Recurring Expenses</h2>
            <ul>
                {data.recurringExpenses.map(recurringExpense => (
                    <li key={recurringExpense._id}>{recurringExpense.description}: ${recurringExpense.amount} ({recurringExpense.frequency})</li>
                ))}
            </ul>
            <h2>Expense Categories</h2>
            <ul>
                {data.expenseCategories.map(category => (
                    <li key={category._id}>{category.name} - {category.type}</li>
                ))}
            </ul>
            <h2>Profit Categories</h2>
            <ul>
                {data.profitCategories.map(category => (
                    <li key={category._id}>{category.name} - {category.type}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
