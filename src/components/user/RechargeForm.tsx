import React, { useState } from 'react';
import { Card, Form, Button, Alert, InputGroup, Row, Col } from 'react-bootstrap';
import { performTopUp } from '../../services/walletService';

interface RechargeFormProps {
    onTopUpSuccess?: (newBalance: number) => void;
}

const RechargeForm: React.FC<RechargeFormProps> = ({ onTopUpSuccess }) => {
    const [amount, setAmount] = useState<number | ''>('');
    const [targetDocument, setTargetDocument] = useState<string>('');
    const [targetPhone, setTargetPhone] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (typeof amount !== 'number' || amount <= 0) {
            setMessage({ type: 'danger', text: '❌ Ingrese una cantidad válida y positiva.' });
            return;
        }

        if (targetDocument.trim().length === 0 || targetPhone.trim().length === 0) {
            setMessage({ type: 'danger', text: '❌ El documento y el teléfono del destinatario son obligatorios.' });
            return;
        }

        setLoading(true);

        try {
            const response = await performTopUp(amount, targetDocument.trim(), targetPhone.trim());

            setMessage({
                type: 'success',
                text: `✅ Recarga Exitosa a ${targetPhone}. Documento: ${response?.document}. Nuevo Saldo (Propio): ${response.newBalance ? formatCurrency(Number(response.newBalance)) : '0,00'}`,
            });
            setAmount('');
            setTargetDocument('');
            setTargetPhone('');
            if (onTopUpSuccess) {
                onTopUpSuccess(response.newBalance);
            }

        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Fallo en la recarga debido a un error desconocido.';
            setMessage({ type: 'danger', text: `❌ Error: ${msg}` });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number | null): string => {
        if (amount === null) return 'N/A';
        return amount.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2
        });
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value === '' ? '' : parseInt(value, 10));
    };

    const handlePresetAmount = (presetAmount: number) => {
        setAmount(presetAmount);
        setMessage(null);
    };

    const presetAmounts = [10000, 50000, 100000];

    return (
        <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-success text-white">
                <h5 className="mb-0">💵 Recargar Saldo</h5>
            </Card.Header>
            <Card.Body>
                {message && <Alert variant={message.type}>{message.text}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formTargetDocument">
                        <Form.Label className="fw-bold">Documento</Form.Label>
                        <Form.Control
                            type="text"
                            name="targetDocument"
                            value={targetDocument}
                            onChange={(e) => setTargetDocument(e.target.value)}
                            placeholder="Documento de la cuenta a recargar"
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTargetPhone">
                        <Form.Label className="fw-bold">Teléfono a Recargar</Form.Label>
                        <Form.Control
                            type="text"
                            name="targetPhone"
                            value={targetPhone}
                            onChange={(e) => setTargetPhone(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="Ej: 30012345672"
                            required
                            disabled={loading}
                            maxLength={11}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <h6 className="text-muted mb-2">Montos preestablecidos:</h6>
                        {presetAmounts.map(pAmount => (
                            <Col key={pAmount} xs={4} className="d-grid gap-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="my-2 px-1 fw-bold"
                                    onClick={() => handlePresetAmount(pAmount)}
                                >
                                    {formatCurrency(pAmount)}
                                </Button>
                            </Col>
                        ))}
                    </Row>

                    <Form.Group className="mb-3" controlId="formTopUpAmount">
                        <Form.Label className="fw-bold">Cantidad a Recargar (COP)</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                                type="text"
                                name="amount"
                                value={formatCurrency(Number(amount))}
                                onChange={handleAmountChange}
                                placeholder="Mínimo 10,000 COP"
                                required
                                disabled={loading}
                            />
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Su saldo será descontado por el valor de la recarga.
                        </Form.Text>
                    </Form.Group>

                    <Button
                        variant="success"
                        type="submit"
                        disabled={loading || amount === '' || amount <= 0 || targetDocument.trim().length === 0 || targetPhone.trim().length === 0}
                        className="w-100 mt-2"
                    >
                        {loading ? 'Procesando Recarga...' : 'Confirmar Recarga'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default RechargeForm;