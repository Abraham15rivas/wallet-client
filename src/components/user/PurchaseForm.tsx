import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner, Alert, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { fetchUserPurchases, startPayment, checkPayment } from '../../services/walletService';
import type { PurchaseState, ModalState } from '../../interfaces/wallet.interface'

const UserPurchasesTable: React.FC = () => {
    const { user } = useAuth();

    const [state, setState] = useState<PurchaseState>({
        purchases: [],
        loading: false,
        error: null,
    });

    const [modalState, setModalState] = useState<ModalState>({
        show: false,
        purchaseId: null,
        tokenInput: '',
        loading: false,
        message: null,
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge bg="success" className="shadow-sm">Activa</Badge>;
            case 'FINISHED':
                return <Badge bg="secondary" className="shadow-sm">Finalizada</Badge>;
            default:
                return <Badge bg="warning" className="shadow-sm">Desconocida</Badge>;
        }
    };

    const loadPurchases = async () => {
        const userDocument = user?.document;

        if (!userDocument) {
            setState(state => ({ ...state, error: "Error: Documento de usuario no disponible para cargar compras." }));
            return;
        }

        setState(state => ({ ...state, loading: true, error: null }));

        try {
            const purchases = await fetchUserPurchases(userDocument);
            setState(state => ({ ...state, purchases, loading: false }));
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Fallo al cargar las compras.';
            setState(state => ({ ...state, error: `Error de carga: ${msg}`, loading: false }));
        }
    };

    useEffect(() => {
        loadPurchases();
    }, [user?.document]);

    const handleShowModal = async (purchaseId: number) => {
        await startPayment(purchaseId, user ? user?.document : '')

        setModalState({
            show: true,
            purchaseId,
            tokenInput: '',
            loading: false,
            message: null
        });
    };

    const handleCloseModal = () => {
        const wasSuccessful = modalState.message?.includes('✅');

        setModalState(state => ({ ...state, show: false }));

        if (wasSuccessful) {
            loadPurchases();
        }
    };

    const handleSubmitToken = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalState.purchaseId || !modalState.tokenInput) return;

        setModalState(state => ({ ...state, loading: true, message: null }));

        try {
            const result = await checkPayment(modalState.purchaseId, modalState.tokenInput);

            if (result.message) {
                setModalState(state => ({
                    ...state,
                    loading: false,
                    message: `✅ ${result.message}`,
                    tokenInput: ''
                }));
            }

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error desconocido en el pago.';
            setModalState(state => ({
                ...state,
                loading: false,
                message: `❌ Error: ${msg}`
            }));
        }
    };

    const { purchases, loading, error } = state;

    return (
        <>
            <Card className="shadow-lg mt-5 border-0 rounded-4">
                <Card.Header className="bg-info text-white rounded-top-4">
                    <h5 className="mb-0">📜 Historial de Compras</h5>
                </Card.Header>
                <Card.Body>
                    {loading && (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="info" role="status">
                                <span className="visually-hidden">Cargando compras...</span>
                            </Spinner>
                            <p className="mt-2 text-info">Cargando historial de compras...</p>
                        </div>
                    )}

                    {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

                    {!loading && !error && purchases.length === 0 && (
                        <Alert variant="info" className="text-center rounded-3">Aún no se han registrado compras para este usuario.</Alert>
                    )}

                    {!loading && !error && purchases.length > 0 && (
                        <Table responsive striped bordered hover className="mt-3 align-middle table-sm rounded-3 overflow-hidden">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Monto</th>
                                    <th>Producto</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((purchase) => (
                                    <tr key={purchase.id}>
                                        <td>{purchase.id}</td>
                                        <td className="fw-bold">{formatCurrency(parseFloat(purchase.amount))}</td>
                                        <td>{purchase.product}</td>
                                        <td>{getStatusBadge(purchase.status)}</td>
                                        <td>
                                            {purchase.status === 'ACTIVE' ? (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleShowModal(purchase.id)}
                                                    className="shadow-sm me-2"
                                                >
                                                    Pagar
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" size="sm" disabled>
                                                    Pagado
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <Modal show={modalState.show} onHide={handleCloseModal} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Finalizar Pago de Compra #{modalState.purchaseId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalState.message && (
                        <Alert variant={modalState.message.startsWith('✅') ? 'success' : 'danger'}>
                            {modalState.message}
                        </Alert>
                    )}
                    <p>Por favor, introduce el **token de seguridad** que has recibido en tu correo electrónico o SMS para completar la compra.</p>
                    <Form onSubmit={handleSubmitToken}>
                        <Form.Group className="mb-3" controlId="formToken">
                            <Form.Label>Token de Seguridad</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ej: 123456"
                                value={modalState.tokenInput}
                                onChange={(e) => setModalState(s => ({ ...s, tokenInput: e.target.value, message: null }))}
                                required
                                disabled={modalState.loading || modalState.message?.startsWith('✅')}
                            />
                            <Form.Text className="text-muted">
                                Este token verifica la seguridad de la transacción.
                            </Form.Text>
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button
                                variant="success"
                                type="submit"
                                disabled={modalState.loading || modalState.message?.startsWith('✅')}
                            >
                                {modalState.loading ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        {' '}Procesando...
                                    </>
                                ) : (
                                    'Confirmar Pago'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleCloseModal}>
                        {modalState.message?.startsWith('✅') ? 'Cerrar y Actualizar' : 'Cancelar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UserPurchasesTable;