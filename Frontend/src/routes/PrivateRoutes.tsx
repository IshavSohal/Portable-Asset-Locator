import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

const PrivateRoutes = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/signin" replace={true} />;
    return <Outlet />;
};

export default PrivateRoutes;
