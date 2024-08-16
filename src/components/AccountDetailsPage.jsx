import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";
import { API_URL } from "../config.js";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const AccountDetails = () => {
  const { accountId } = useParams()
  const navigate = useNavigate()
  const { user, isLoading, isLoggedIn } = useContext(AuthContext)
  const [account, setAccount] = useState(null) // State to store account details
  const [expenses, setExpenses] = useState([])
  const [profits, setProfits] = useState([])
  const [error, setError] = useState("")
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTransactionId, setEditingTransactionId] = useState(null)

  const [expenseData, setExpenseData] = useState({
    amount: '',
    category: {
      name: '',
      default: true,
    },
    description: '',
    date: new Date().toISOString().slice(0, 10),
  })

  const [profitData, setProfitData] = useState({
    amount: '',
    category: {
      name: '',
      default: true,
    },
    description: '',
    date: new Date().toISOString().slice(0, 10),
  })

  const expenseCategories = [
    'Rent', 'Mortgage', 'Food', 'Transport', 'Utilities', 
    'Entertainment', 'Healthcare', 'Travel', 'Other'
  ]

  const profitCategories = [
    'Salary', 'Investment', 'Gift', 'Business', 'Other'
  ]

  useEffect(() => {
    if (isLoading) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          setError("Authentication token not found")
          navigate("/login");
          return
        }

        const accountRes = await axios.get(`${API_URL}/api/accounts/${accountId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("Fetched Account:", accountRes.data); 
        setAccount(accountRes.data);

        const expensesRes = await axios.get(`${API_URL}/api/expenses/account/${accountId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setExpenses(expensesRes.data);

        const profitsRes = await axios.get(`${API_URL}/api/profits/account/${accountId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProfits(profitsRes.data);
      } catch (err) {
        console.error("Error fetching account details:", err.response || err);
        setError("Failed to fetch account details");
      }
    }

    fetchAccountDetails();
  }, [accountId, isLoading, isLoggedIn, navigate]);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");

      const amount = parseFloat(expenseData.amount);
      if (isNaN(amount) || !expenseData.category.name.trim()) {
        setError("Amount must be a number and category name must be provided")
        return
      }

      const expensePayload = {
        amount,
        category: {
          name: expenseData.category.name.trim(),
          default: true,
        },
        description: expenseData.description,
        date: new Date(expenseData.date),
        account: accountId,
      }

      if (isEditing && editingTransactionId) {
        await axios.put(
          `${API_URL}/api/expenses/${editingTransactionId}`,
          expensePayload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setExpenses(expenses.map(expense => expense._id === editingTransactionId ? { ...expensePayload, _id: editingTransactionId } : expense))
      } else {
        const response = await axios.post(
          `${API_URL}/api/expenses`,
          expensePayload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setExpenses([...expenses, response.data]);
      }

      setExpenseData({ amount: '', category: { name: '', default: true }, description: '', date: new Date().toISOString().slice(0, 10) })
      setIsExpenseModalOpen(false)
      setIsEditing(false)
      setEditingTransactionId(null)
    } catch (err) {
      console.error("Error creating/updating expense:", err.response || err)
      setError("Failed to create/update expense")
    }
  };

  const handleProfitSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("authToken")
      const amount = parseFloat(profitData.amount)
      if (isNaN(amount) || !profitData.category.name.trim()) {
        setError("Amount must be a number and category name must be provided")
        return;
      }

      const profitPayload = {
        amount,
        category: {
          name: profitData.category.name.trim(),
          default: true,
        },
        description: profitData.description, 
        date: new Date(profitData.date),
        account: accountId,
      }

      if (isEditing && editingTransactionId) {
        await axios.put(
          `${API_URL}/api/profits/${editingTransactionId}`,
          profitPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfits(profits.map(profit => profit._id === editingTransactionId ? { ...profitPayload, _id: editingTransactionId } : profit))
      } else {
        // Create new profit
        const response = await axios.post(
          `${API_URL}/api/profits`,
          profitPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setProfits([...profits, response.data])
      }

      setProfitData({ amount: '', category: { name: '', default: true }, description: '', date: new Date().toISOString().slice(0, 10) })
      setIsProfitModalOpen(false)
      setIsEditing(false)
      setEditingTransactionId(null)
    } catch (err) {
      console.error("Error creating/updating profit:", err.response || err)
      setError("Failed to create/update profit")
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const token = localStorage.getItem("authToken")
      if (type === 'expense') {
        await axios.delete(`${API_URL}/api/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExpenses(expenses.filter(expense => expense._id !== id))
      } else {
        await axios.delete(`${API_URL}/api/profits/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfits(profits.filter(profit => profit._id !== id))
      }
    } catch (err) {
      console.error("Error deleting transaction:", err.response || err)
      setError("Failed to delete transaction");
    }
  };

  const handleEdit = (transaction, type) => {
    setIsEditing(true)
    setEditingTransactionId(transaction._id)
    if (type === 'expense') {
      setExpenseData({
        amount: transaction.amount,
        category: {
          name: transaction.category.name,
          default: true,
        },
        description: transaction.description,
        date: new Date(transaction.date).toISOString().slice(0, 10),
      })
      setIsExpenseModalOpen(true);
    } else {
      setProfitData({
        amount: transaction.amount,
        category: {
          name: transaction.category.name,
          default: true,
        },
        description: transaction.description, 
        date: new Date(transaction.date).toISOString().slice(0, 10),
      })
      setIsProfitModalOpen(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {account && (
        <div>
          <h1>{account.name}</h1>
          <h2>Balance: {account.balance}€</h2>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ width: '40%' }}>
          <h2>Transactions</h2>
          <PieChart expenses={expenses} profits={profits} />
        </div>
        <div style={{ width: '55%' }}>
          <h3>All Transactions</h3>
          <TransactionsTable 
            expenses={expenses} 
            profits={profits} 
            handleDelete={handleDelete} 
            handleEdit={handleEdit} 
          />
          <button onClick={() => setIsExpenseModalOpen(true)}>Add Expense</button>
          <button onClick={() => setIsProfitModalOpen(true)}>Add Profit</button>
        </div>
      </div>

      {isExpenseModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsExpenseModalOpen(false)}>&times;</span>
            <h3>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h3>
            <form onSubmit={handleExpenseSubmit}>
              <input
                type="number"
                placeholder="Amount"
                value={expenseData.amount}
                onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                required
              />
              <select
                value={expenseData.category.name}
                onChange={(e) => setExpenseData({ ...expenseData, category: { ...expenseData.category, name: e.target.value } })}
                required
              >
                <option value="" disabled>Select Category</option>
                {expenseCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={expenseData.description}
                onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
              />
              <input
                type="date"
                value={expenseData.date}
                onChange={(e) => setExpenseData({ ...expenseData, date: e.target.value })}
                required
              />
              <button type="submit">{isEditing ? 'Update Expense' : 'Add Expense'}</button>
            </form>
          </div>
        </div>
      )}

      {isProfitModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsProfitModalOpen(false)}>&times;</span>
            <h3>{isEditing ? 'Edit Profit' : 'Add New Profit'}</h3>
            <form onSubmit={handleProfitSubmit}>
              <input
                type="number"
                placeholder="Amount"
                value={profitData.amount}
                onChange={(e) => setProfitData({ ...profitData, amount: e.target.value })}
                required
              />
              <select
                value={profitData.category.name}
                onChange={(e) => setProfitData({ ...profitData, category: { ...profitData.category, name: e.target.value } })}
                required
              >
                <option value="" disabled>Select Category</option>
                {profitCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={profitData.description} 
                onChange={(e) => setProfitData({ ...profitData, description: e.target.value })}
              />
              <input
                type="date"
                value={profitData.date}
                onChange={(e) => setProfitData({ ...profitData, date: e.target.value })}
                required
              />
              <button type="submit">{isEditing ? 'Update Profit' : 'Add Profit'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const PieChart = ({ expenses, profits }) => {
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0)
  const totalProfits = profits.reduce((total, profit) => total + profit.amount, 0)
  const total = totalExpenses + totalProfits;

  const data = {
    labels: [
      `Expenses (${((totalExpenses / total) * 100).toFixed(0)}%)`,
      `Profits (${((totalProfits / total) * 100).toFixed(0)}%)`,
    ],
    datasets: [
      {
        data: [totalExpenses, totalProfits],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return <Pie data={data} />;
};

const TransactionsTable = ({ expenses, profits, handleDelete, handleEdit }) => (
  <table>
    <thead>
      <tr>
        <th>Transaction Name</th>
        <th>Transaction Type</th>
        <th>Amount</th>
        <th>Date</th>
        <th>Edit/Delete</th>
      </tr>
    </thead>
    <tbody>
      {expenses.map(expense => (
        <tr key={expense._id}>
          <td>{expense.description}</td>
          <td>EXPENSE</td>
          <td>-{expense.amount}€</td>
          <td>{new Date(expense.date).toLocaleDateString()}</td>
          <td>
            <button onClick={() => handleEdit(expense, 'expense')}>Edit</button>
            <button onClick={() => handleDelete(expense._id, 'expense')}>Delete</button>
          </td>
        </tr>
      ))}
      {profits.map(profit => (
        <tr key={profit._id}>
          <td>{profit.description || 'No Description'}</td>
          <td>PROFIT</td>
          <td>{profit.amount}€</td>
          <td>{new Date(profit.date).toLocaleDateString()}</td>
          <td>
            <button onClick={() => handleEdit(profit, 'profit')}>Edit</button>
            <button onClick={() => handleDelete(profit._id, 'profit')}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AccountDetails;
