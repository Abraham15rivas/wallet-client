import React from 'react';
import Layout from '../components/layout/Layout';
import { Container, Row, Col } from 'react-bootstrap';
import BalanceCard from '../components/user/BalanceCard';
import RechargeForm from '../components/user/RechargeForm';
import PurchaseForm from '../components/user/PurchaseForm';

const HomePage: React.FC = () => {
    return (
        <Layout>
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md={12} lg={12}>
                        <h1 className="text-center mb-4 text-secondary">Dashboard de la Billetera</h1>
                        <Row>
                            <Col md={6} className="mb-4">
                                <BalanceCard />
                            </Col>

                            <Col md={6} className="mb-4">
                                <RechargeForm />
                            </Col>

                            <Col md={12} className="mb-4">
                                <PurchaseForm />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default HomePage;