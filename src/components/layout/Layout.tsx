import React, { type ReactNode } from 'react';
import { Container } from 'react-bootstrap'; // 💡 Importamos Container
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <main className="flex-grow-1 p-4">
                <Container>
                    {children}
                </Container>
            </main>

            <Footer />
        </div>
    );
};

export default Layout;