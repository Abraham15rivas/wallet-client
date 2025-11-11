import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { Navbar, Nav, Button, Container } from 'react-bootstrap';

const Header: React.FC = () => {
    const { user, isAuthenticated, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut();
        navigate('/login');
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/">
                    💳 **E-Wallet App**
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {isAuthenticated ? (
                            // Vista Autenticado
                            <>
                                <span className="navbar-text me-3">
                                    Welcome, **{user?.document}** ({user?.email})
                                </span>
                                <Button
                                    onClick={handleLogout}
                                    variant="danger"
                                    size="sm"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            // Vista No Autenticado
                            <>
                                <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
                                <Nav.Link onClick={() => navigate('/register')}>Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;