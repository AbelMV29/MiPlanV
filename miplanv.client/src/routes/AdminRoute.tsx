import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, isAuthenticated } = useAuthStore();
    const isAdmin = isAuthenticated && user?.role === 'Admin';
    
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
};

export default AdminRoute; 