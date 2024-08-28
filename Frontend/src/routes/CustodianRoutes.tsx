import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';

const PrivateRoutes = () => {
  const { user } = useAuth();

  if (user && user.role == 'Custodian') return <Outlet />;
  return <Navigate to="/dashboard" replace={true} />;
};

export default PrivateRoutes;
