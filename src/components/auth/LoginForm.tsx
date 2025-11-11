import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import type { ILoginCredentials } from '../../interfaces/auth.interface';

const LoginForm: React.FC = () => {
    const { signIn }    = useAuth();
    const navigate      = useNavigate();

    const [credentials, setCredentials] = useState<ILoginCredentials>({ email: '', password: '' });
    const [error, setError]             = useState<string>('');
    const [loading, setLoading]         = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(credentials);
            navigate('/home');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed.';
            setError(message || 'Email o contraseña incorrectos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-3 shadow">
            <h4 className="mb-4 text-center text-primary">Inicia Sesión</h4>

            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                {/* 💡 CAMBIO: Email */}
                <Form.Group className="mb-3" controlId="formLoginEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="Ingresa tu correo electrónico"
                        required
                    />
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="mb-4" controlId="formLoginPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        required
                    />
                </Form.Group>

                {/* Botón de Submit */}
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100"
                >
                    {loading ? 'Validando...' : 'Iniciar Sesión'}
                </Button>
            </Form>
            <p className="mt-3 text-center">
                ¿No tienes una cuenta? <Button variant="link" onClick={() => navigate('/register')}>Regístrate</Button>
            </p>
        </Card>
    );
};

export default LoginForm;