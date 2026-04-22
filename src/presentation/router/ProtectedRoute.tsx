import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/context/useAuth';
import StatusPanel from '../../infrastructure/ui/components/StatusPanel';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isMenuLoading, canAccessPath } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isMenuLoading) {
    return <StatusPanel variant="loading" title="Cargando permisos" message="Validando acceso..." />;
  }

  if (!canAccessPath(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
