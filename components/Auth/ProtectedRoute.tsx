import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const session = useStore((state) => state.session);

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
