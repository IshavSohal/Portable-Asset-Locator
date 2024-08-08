import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

const UnauthRoutes = () => {
    const { user } = useAuth();

    if (user) return <Navigate to="/dashboard" replace={true} />;
    return <Outlet />;
};

export default UnauthRoutes;
