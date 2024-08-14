import { useState, useContext } from 'react';
import { AuthContext } from '../context/auth.context';

const Header = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const [showLogout, setShowLogout] = useState(false);

  // Toggle visibility of the logout button
  const toggleLogout = () => {
    setShowLogout(prev => !prev);
  };
  return (
    <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', borderBottom: '1px solid #ccc' }}>
      {user && (
        <div>
          <span 
            onClick={toggleLogout} 
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            {user.name}
          </span>
          {showLogout && (
            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

