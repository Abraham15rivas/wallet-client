import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Container, Card } from 'react-bootstrap';

const RegisterPage: React.FC = () => {
    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                backgroundColor: '#f4f7f6',
                padding: '1rem'
            }}
        >
            <Card style={{ width: '50%' }}>
                <Card.Body>
                    <div className="text-center mb-4">
                        <h1 className="text-primary">📝 Crear Cuenta</h1>
                        <p className="text-muted">Completa el formulario para registrarte.</p>
                    </div>
                    <RegisterForm />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterPage;