import React from 'react';
import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
    return (
        <footer className="mt-auto py-3 bg-light border-top">
            <Container>
                <p className="text-muted text-center mb-0">
                    &copy; {new Date().getFullYear()} E-Wallet App | Developed for Test - EPayco.
                </p>
            </Container>
        </footer>
    );
};

export default Footer;