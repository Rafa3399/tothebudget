// /components/LoginPage.js
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
    const [signupName, setSignupName] = useState('');
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { authenticateUser } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { authToken } = response.data;
            localStorage.setItem('authToken', authToken);
            await authenticateUser();
            navigate('/dashboard');
        } catch (err) {
            // Log detailed information about the error
            console.log('Axios error:', err);
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log('Error response data:', err.response.data);
                console.log('Error response status:', err.response.status);
                console.log('Error response headers:', err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                console.log('Error request:', err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error message:', err.message);
            }
            console.log('Error config:', err.config);
    
            setError(err.response?.data?.message || 'Login failed! Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await axios.post(`${API_URL}/auth/signup`, {
                email: signupEmail,
                password: signupPassword,
                name: signupName  
            });
            setIsSignup(false);
            setError('Signup successful! Please log in.');
        } catch (err) {
            // Log detailed information about the error
            console.log('Axios error:', err);
            if (err.response) {
                console.log('Error response data:', err.response.data);
                console.log('Error response status:', err.response.status);
                console.log('Error response headers:', err.response.headers);
            } else if (err.request) {
                console.log('Error request:', err.request);
            } else {
                console.log('Error message:', err.message);
            }
            console.log('Error config:', err.config);
    
            setError('Signup failed! ' + (err.response?.data?.message || 'Please try again.'));
        } finally {
            setIsLoading(false);
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
                            type="text"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="Name"
                            required
                        />
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
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing up...' : 'Sign Up'}
                        </button>
                        <button type="button" onClick={() => setIsSignup(false)}>
                            Back to Login
                        </button>
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
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                        <button type="button" onClick={() => setIsSignup(true)}>
                            Create an Account
                        </button>
                    </form>
                </>
            )}
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Contact Section */}
            <div className="contact-section">
                <h3>Contact</h3>
                <p>
                    <a href="https://www.linkedin.com/in/rafael-hernandez-soler-7a449323b/" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a> | 
                    <a href="https://github.com/Rafa3399" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
