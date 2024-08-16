import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import ManageAssets from './pages/ManageAssets';
import MainTemplate from './templates/MainTemplate';
import SignOn from './pages/SignOn';
import { useAuth } from './hooks/AuthProvider';
import { useEffect, useState } from 'react';
import PrivateRoutes from './routes/PrivateRoutes';
import UnauthRoutes from './routes/UnauthRoutes';
import AssetProfile from './pages/AssetProfile';
import CustodianRoutes from './routes/CustodianRoutes';
import NotFound from './pages/NotFound';

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
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/asset/:assetid" element={<AssetProfile />} />
            <Route element={<CustodianRoutes />}>
              <Route path="/manage-assets" element={<ManageAssets />} />
            </Route>
          </Route>
          <Route element={<UnauthRoutes />}>
            <Route path="/signin" element={<SignOn />} />
            <Route path="/register" element={<Registration />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }
}

function Home() {
  return (
    <MainTemplate>
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
