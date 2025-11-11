import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Container, Card } from 'react-bootstrap';

const LoginPage: React.FC = () => {
    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <h1 className="text-primary">💳 Wallet App Login</h1>
                        <p className="text-muted">Por favor, ingresa tus credenciales.</p>
                    </div>
                    <LoginForm />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;