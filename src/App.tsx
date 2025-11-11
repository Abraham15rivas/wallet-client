import React, { type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Container, Spinner } from 'react-bootstrap';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <Container
                fluid
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ minHeight: '100vh' }}
            >
                <Spinner
                    animation="border"
                    role="status"
                    variant="primary"
                    className="mb-3"
                />
                <h2>Cargando Autenticación...</h2>
            </Container>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Rutas Privadas */}
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    }
                />

                {/* Redirección de la ruta raíz */}
                <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
        </Router>
    );
};

export default App;