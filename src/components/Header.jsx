import { useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, handleLogout } = useContext(AuthContext);
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();

    const toggleLogout = () => setShowLogout(prev => !prev);

    const handleLogoutAndNavigate = async () => {
        try {
            await handleLogout(); // Perform logout
            navigate('/'); // Navigate to the login page
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <header className="header">
            {user && (
                <div>
                    <span onClick={toggleLogout} style={{ cursor: 'pointer' }}>{user.name}</span>
                    {showLogout && (
                        <button className="logout-btn" onClick={handleLogoutAndNavigate}>
                            Logout
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
