import { useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const { user, handleLogout } = useContext(AuthContext)
    const [showLogout, setShowLogout] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const toggleLogout = () => setShowLogout(prev => !prev)

    const handleLogoutAndNavigate = async () => {
        try {
            await handleLogout()
            navigate('/')
        } catch (err) {
            console.error('Logout failed:', err)
        }
    };

    const handleGoBack = () => {
        navigate(-1)
    }

    const isAccountDetailsPage = location.pathname.includes("/accounts/")

    return (
        <header className="header">
            {isAccountDetailsPage && (
                <button onClick={handleGoBack} className="back-btn">
                    <p>🡸</p>
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
