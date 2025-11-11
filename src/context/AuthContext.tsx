import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loginUser } from '../services/authService';
import type { ILoginCredentials, IUser } from '../interfaces/auth.interface';

const fetchUserFromToken = async (storedToken: string): Promise<IUser | null> => {
    if (storedToken && storedToken.length > 10) {
        const user = JSON.parse(localStorage.getItem('user') as any)
        return user
    }
    return null;
};

interface IAuthContext {
    user: IUser | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    signIn: (credentials: ILoginCredentials) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('userToken'));
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const restoreSession = async () => {
            if (token) {
                try {
                    const fetchedUser = await fetchUserFromToken(token);
                    if (fetchedUser) {
                        setUser(fetchedUser);
                    } else {
                        localStorage.removeItem('userToken');
                        setToken(null);
                    }
                } catch (error) {
                    console.error("Error restoring session:", error);
                    localStorage.removeItem('userToken');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        restoreSession();
    }, []);

    const signIn = async (credentials: ILoginCredentials) => {
        try {
            const userData = await loginUser(credentials);
            setToken(localStorage.getItem('userToken'));
            setUser(userData);
        } catch (error) {
            throw error;
        }
    };

    const signOut = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!user && !!token;

    const value: IAuthContext = {
        user,
        token,
        loading,
        signIn,
        signOut,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};