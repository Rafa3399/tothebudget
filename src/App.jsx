import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AccountDetails from './components/AccountDetails';
import Header from './components/Header';
import { AuthWrapper } from './context/auth.context';
import './App.css';

function App() {
  const API = "https://tothebudget.adaptable.app/";
  
  return (
    <Router>
      <AuthWrapper>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage API={API} />} />
        <Route path="/dashboard" element={<Dashboard API={API} />} />
        <Route path="/accounts/:accountId" element={<AccountDetails API={API}  />} />
      </Routes>
      </AuthWrapper>
    </Router>

  );
}

export default App;