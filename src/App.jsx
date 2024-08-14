import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AccountDetails from './components/AccountDetails';
import Header from './components/Header';
import { AuthWrapper } from './context/auth.context';
import './App.css';

function App() {
  
  return (
    <Router>
      <AuthWrapper>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts/:accountId" element={<AccountDetails />} />
      </Routes>
      </AuthWrapper>
    </Router>

  );
}

export default App;