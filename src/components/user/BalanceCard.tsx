import React, { useState } from 'react';
import { Card, Spinner, Alert, ListGroup, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { fetchCurrentBalance } from '../../services/walletService';

const BalanceCard: React.FC = () => {
    const { user } = useAuth();

    const [queryDocument, setQueryDocument] = useState<string>(user?.document || '');
    const [queryPhone, setQueryPhone] = useState<string>(user?.phone || '');
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lastQueryTime, setLastQueryTime] = useState<Date | null>(null);

    const formatCurrency = (amount: number | null): string => {
        if (amount === null) return 'N/A';
        return amount.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        });
    };

    const handleQuery = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const doc = queryDocument.trim();
        const phone = queryPhone.trim();

        if (doc.length === 0 || phone.length === 0) {
            setError("Documento y Teléfono son requeridos para consultar el saldo.");
            return;
        }

        setLoading(true);

        try {
            const data = await fetchCurrentBalance(doc, phone);
            setBalance(data);
            setLastQueryTime(new Date());

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Fallo desconocido en la consulta.';
            console.error("Error al obtener saldo:", msg);
            setError(`Error: ${msg}`);
            setBalance(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-lg mb-4 border-0">
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">💳 Tu Billetera Digital</h5>
            </Card.Header>
            <Card.Body>
                <h6 className="text-primary mb-2">Detalles de la Cuenta:</h6>
                <ListGroup variant="flush" className="mb-4 border rounded">
                    <ListGroup.Item className="py-2">
                        <span className="text-muted">Nombre:</span>
                        <strong className="float-end text-truncate">{user?.names || 'N/A'}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-2">
                        <span className="text-muted">Email:</span>
                        <strong className="float-end text-truncate">{user?.email || 'N/A'}</strong>
                    </ListGroup.Item>
                </ListGroup>
                <h6 className="text-secondary mb-3">Consultar Saldo (Requiere autenticación):</h6>
                <Form onSubmit={handleQuery}>
                    <Form.Group className="mb-3" controlId="formQueryDocument">
                        <Form.Label className="fw-bold">Documento</Form.Label>
                        <Form.Control
                            type="text"
                            value={queryDocument}
                            onChange={(e) => setQueryDocument(e.target.value)}
                            placeholder="Ingrese su documento"
                            required
                            disabled={loading}
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formQueryPhone">
                        <Form.Label className="fw-bold">Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            value={queryPhone}
                            onChange={(e) => setQueryPhone(e.target.value)}
                            placeholder="Ingrese su teléfono"
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading || queryDocument.trim().length === 0 || queryPhone.trim().length === 0}
                        className="w-100 fw-bold"
                    >
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                Consultando...
                            </>
                        ) : (
                            'Consultar Saldo'
                        )}
                    </Button>
                </Form>
                {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
                {balance !== null && !loading && !error && (
                    <Card className="mt-4 p-3 bg-success bg-opacity-10 border-success shadow-sm">
                        <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 text-success fw-bold">Saldo Disponible:</h6>
                            <h5 className="mb-0 text-success fw-bold">
                                {formatCurrency(Number(balance))}
                            </h5>
                        </div>
                        <p className="mt-2 text-end text-sm text-muted">
                            Consulta realizada: {lastQueryTime?.toLocaleTimeString('es-CO')}
                        </p>
                    </Card>
                )}
            </Card.Body>
        </Card>
    );
};

export default BalanceCard;