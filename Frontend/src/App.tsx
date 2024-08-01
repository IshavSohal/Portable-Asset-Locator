import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import MainTemplate from './templates/MainTemplate';
import SignOn from './pages/SignOn';
import AuthProvider, { useAuth } from './hooks/AuthProvider';
import { useEffect, useState } from 'react';

function App() {
    const { loadUser, user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('Loading App');
        const load = async () => {
            try {
                await loadUser();
                console.log(user);
            } catch (err) {
                console.warn(err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/signin" element={<SignOn />} />
                    <Route path="/register" element={<Registration />} />
                </Routes>
            </Router>
        );
    }
}

function Home() {
    return (
        <MainTemplate addMargins={false}>
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <Link className="App-link" to="/dashboard">
                    Dashboard
                </Link>
            </div>
        </MainTemplate>
    );
}

export default App;
