import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/auth.context";

const LoginPage = ({ API }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();
    const { authenticateUser } = useContext(AuthContext);

    // Handle user login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API}/auth/login`, { email, password });
            const { authToken } = response.data; 
            localStorage.setItem('authToken', authToken); 
            await authenticateUser(); 
            navigate('/dashboard');
        } catch (err) {
            setError('Login failed!');
        }
    };

    // Handle user signup
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/auth/signup`, { email: signupEmail, password: signupPassword });
            setIsSignup(false);
            setError('Signup successful! Please log in.');
        } catch (err) {
            setError('Signup failed!');
        }
    };

    return (
        <div>
            <h1>Welcome to Expense Tracker</h1>
            <p>
                Manage your finances efficiently with our Expense Tracker. 
                Keep track of your expenses, profits, and recurring payments all in one place.
            </p>

            {isSignup ? (
                <div>
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
                        <button type="submit">Sign Up</button>
                        <button type="button" onClick={() => setIsSignup(false)}>Back to Login</button>
                    </form>
                </div>
            ) : (
                <div>
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
                </div>
            )}

            {error && <p>{error}</p>}
        </div>
    );
};

export default LoginPage;
