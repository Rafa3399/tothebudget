import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/auth.context";
import { API_URL } from '../config.js';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();
    const { authenticateUser } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { authToken } = response.data; 
            localStorage.setItem('authToken', authToken); 
            await authenticateUser(); 
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed!');
        }
    };

const [signupName, setSignupName] = useState('');

const handleSignup = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`${API_URL}/auth/signup`, {
            email: signupEmail,
            password: signupPassword,
            name: signupName  // Ensure the name is included
        });
        setIsSignup(false);
        setError('Signup successful! Please log in.');
    } catch (err) {
        setError('Signup failed! ' + (err.response?.data?.message || ''));
    }
};


    return (
        <div className="container">
            <h1>Expense Tracker</h1>
            <p>Manage your finances efficiently with our Expense Tracker.</p>
            
            {isSignup ? (
                <>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignup}>
                        <input
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />

<input
    type="text"
    value={signupName}
    onChange={(e) => setSignupName(e.target.value)}
    placeholder="Name"
    required
/>
                        <button type="submit">Sign Up</button>
                        <button type="button" onClick={() => setIsSignup(false)}>Back to Login</button>
                    </form>
                </>
            ) : (
                <>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                        <button type="submit">Login</button>
                        <button type="button" onClick={() => setIsSignup(true)}>Create an Account</button>
                    </form>
                </>
            )}
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LoginPage;
