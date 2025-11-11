import React, { useState } from 'react';
import { Card, Form, Button, Alert, InputGroup, Row, Col } from 'react-bootstrap';
import { performTopUp } from '../../services/walletService';
import { formatCurrency } from '../../utils/formatCurrency';

interface RechargeFormProps {
    onTopUpSuccess?: (newBalance: number) => void;
}

const RechargeForm: React.FC<RechargeFormProps> = ({ onTopUpSuccess }) => {
    const [amountInput, setAmountInput] = useState<string>('');
    const [targetDocument, setTargetDocument] = useState<string>('');
    const [targetPhone, setTargetPhone] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
    const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);

    const getCleanAmount = (input: string): number => {
        let cleanString = input.replace(/,/g, '.').replace(/[^\d.]/g, '');
        const parts = cleanString.split('.');

        if (parts.length > 2) {
            cleanString = parts[0] + '.' + parts.slice(1).join('');
        }

        if (parts.length > 1) {
            cleanString = parts[0] + '.' + parts[1].slice(0, 2);
        }

        const result = parseFloat(cleanString);
        return isNaN(result) ? 0 : result;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const amountValue = getCleanAmount(amountInput);

        if (amountValue <= 0) {
            setMessage({ type: 'danger', text: '❌ Ingrese una cantidad válida y positiva.' });
            return;
        }

        if (targetDocument.trim().length === 0 || targetPhone.trim().length === 0) {
            setMessage({ type: 'danger', text: '❌ El documento y el teléfono son obligatorios.' });
            return;
        }

        setLoading(true);

        try {
            const response = await performTopUp(amountValue, targetDocument.trim(), targetPhone.trim());

            setMessage({
                type: 'success',
                text: `✅ Recarga Exitosa a ${targetPhone}. Documento: ${response?.document}. Nuevo Saldo (Propio): ${response.newBalance ? formatCurrency(Number(response.newBalance)) : '0'}`,
            });
            setAmountInput('');
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

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let cleanValue = value.replace(/[^\d.,]/g, '');

        cleanValue = cleanValue.replace(/,/g, '.');

        const parts = cleanValue.split('.');
        if (parts.length > 2) {
            cleanValue = parts[0] + '.' + parts.slice(1).join('');
        }

        if (parts.length > 1) {
            cleanValue = parts[0] + '.' + parts[1].slice(0, 2);
        }

        if (cleanValue === '.') cleanValue = '0.';

        if (cleanValue.length > 1 && cleanValue.startsWith('0') && cleanValue[1] !== '.') {
             cleanValue = cleanValue.substring(1);
        }

        setAmountInput(cleanValue);
        setMessage(null);
    };

    const handlePresetAmount = (presetAmount: number) => {
        setAmountInput(presetAmount.toFixed(2));
        setMessage(null);
    };

    const presetAmounts = [10000, 50000, 100000];
    const amountValue = getCleanAmount(amountInput);

    const displayValue = isAmountFocused
        ? amountInput
        : formatCurrency(amountValue);

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
                            placeholder="Documento"
                            required
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formTargetPhone">
                        <Form.Label className="fw-bold">Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="targetPhone"
                            value={targetPhone}
                            onChange={(e) => setTargetPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
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
                                    variant={amountValue === pAmount ? "primary" : "outline-primary"}
                                    size="sm"
                                    className="my-2 px-1 fw-bold"
                                    onClick={() => handlePresetAmount(pAmount)}
                                    disabled={loading}
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
                                value={displayValue}
                                onChange={handleAmountChange}
                                onFocus={() => setIsAmountFocused(true)}
                                onBlur={() => setIsAmountFocused(false)}
                                placeholder="Mínimo 10.000,00 COP"
                                required
                                disabled={loading}
                            />
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Su saldo será agregado por el valor de la recarga. (Ej. 10000.50)
                        </Form.Text>
                    </Form.Group>

                    <Button
                        variant="success"
                        type="submit"
                        disabled={loading || amountValue < 10000 || targetDocument.trim().length === 0 || targetPhone.trim().length < 10}
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