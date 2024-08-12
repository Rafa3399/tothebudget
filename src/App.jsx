
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

const App = () => {
  const API = "http://localhost:5005";
    return (
        <Router>
            <Routes>
                <Route path="/dashboard" element={<Dashboard API={API}/>} />
                <Route path="/" element={<LoginPage API={API} />} />
            </Routes>
        </Router>
    );
};

export default App;
