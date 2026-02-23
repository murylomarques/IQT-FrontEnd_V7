import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { readMonitorMagicToken } from '../utils/monitorMagic';

const MonitorRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const magicToken = readMonitorMagicToken(location.search);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (user) {
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
    }
    return children;
  }

  if (magicToken) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default MonitorRoute;

