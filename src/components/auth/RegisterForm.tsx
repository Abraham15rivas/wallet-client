import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import type { IRegisterData } from '../../interfaces/auth.interface';
import { registerUser } from '../../services/authService'; 

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<IRegisterData>({
        names: '',
        document: '',
        phone: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        try {
            const user = await registerUser(formData);
            setMessage({
                type: 'success',
                text: `✅ ¡Registro Exitoso! Usuario ${user.document} creado. Redirigiendo a login...`
            });
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Fallo en el registro debido a un error desconocido.';
            setMessage({ type: 'danger', text: `❌ Error: ${msg}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h4 className="text-center mb-4 text-primary">Crear Cuenta de Billetera</h4>

            {message && <Alert variant={message.type} className="text-center">{message.text}</Alert>}

            <Form onSubmit={handleSubmit}>

                {/* Names */}
                <Form.Group className="mb-3" controlId="formRegNames">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control
                        type="text"
                        name="names"
                        value={formData.names}
                        onChange={handleChange}
                        placeholder="Ej. Juan Pérez"
                        required
                    />
                </Form.Group>

                {/* Documento */}
                <Form.Group className="mb-3" controlId="formRegDocument">
                    <Form.Label>Documento</Form.Label>
                    <Form.Control
                        type="text"
                        name="document"
                        value={formData.document}
                        onChange={handleChange}
                        placeholder="Cédula o ID"
                        required
                    />
                </Form.Group>

                {/* Teléfono */}
                <Form.Group className="mb-3" controlId="formRegPhone">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ej. 3001234567"
                        required
                    />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3" controlId="formRegEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        required
                    />
                </Form.Group>

                {/* Contraseña */}
                <Form.Group className="mb-4" controlId="formRegPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 8 caracteres"
                        required
                    />
                </Form.Group>

                {/* Botón de envio*/}
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="w-100"
                >
                    {loading ? 'Registrando...' : 'Registrar Cuenta'}
                </Button>
            </Form>

            <p className="mt-3 text-center">
                ¿Ya tienes una cuenta? <Button variant="link" onClick={() => navigate('/login')}>Inicia Sesión</Button>
            </p>
        </>
    );
};

export default RegisterForm;