export const API_ENDPOINTS = {
    // === Módulos de Autenticación (Auth) ===
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout'
    },

    // === Módulos de Usuarios y Operaciones (Users) ===
    USERS: {
        TOP_UP: '/users/top-up',
        BALANCE: '/users/balance',
        START_PAYMENT: (document: string) => `/users/${document}/start-payment`,
        CHECK_PAYMENT: '/users/check-payment'
    },

    // === Módulo de Compras/Transacciones (Purchases) ===
    PURCHASES: {
        HISTORY: '/purchases',
        GET_BY_DOCUMENT: (document: string) => `/purchases/${document}`,
    }
};