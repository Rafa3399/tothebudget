// /components/Header.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const { user, handleLogout } = useContext(AuthContext);
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleLogout = () => setShowLogout(prev => !prev);

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutAndNavigate = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
        await handleLogout(); // Perform logout
        navigate('/'); // Navigate to the login page
    } catch (err) {
        console.error('Logout failed:', err);
    } finally {
        setIsLoggingOut(false);
    }
};

    const handleGoBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    // Determine if the back arrow should be shown based on the current route
    const showBackArrow = location.pathname.includes('/accounts/');

    return (
        <header className="header">
            {showBackArrow && (
                <button onClick={handleGoBack} className="back-btn">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
            )}
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
