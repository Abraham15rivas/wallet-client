import api from '../api/api';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import type { IStandardResponse } from '../interfaces/auth.interface';
import type {
    ITopUpResponse,
    IBalanceRequest,
    IBalanceResponse,
    ITopUpRequest,
    Purchase,
    IStartPayment
} from '../interfaces/wallet.interface'

export const fetchCurrentBalance = async (document: string, phone: string): Promise<number> => {
    const data: IBalanceRequest = {
        document,
        phone
    }

    try {
        const response = await api.post<IStandardResponse<IBalanceResponse>>(API_ENDPOINTS.USERS.BALANCE, data);

        if (response.data.statusCode === 200 && response.data.data) {
            return response.data.data.balance;
        }

        if (response.data.statusCode === 200 && response.data.data == null) {
            throw new Error('Verifique sus credenciales.');
        }

        throw new Error(response.data.message || 'Error al obtener el saldo.');
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const serverMessage = error.response.data?.message || 'Fallo en la consulta de saldo.';
            throw new Error(serverMessage);
        }
        throw new Error('Fallo en la conexión o el servidor no responde.');
    }
};

export const performTopUp = async (amount: number, document: string, phone: string): Promise<ITopUpResponse> => {
    const data: ITopUpRequest = { amount, document, phone };

    try {
        const response = await api.post<IStandardResponse<ITopUpResponse>>(API_ENDPOINTS.USERS.TOP_UP, data);

        if (response.data.statusCode === 200 && response.data.data) {
            return response.data.data;
        }

        throw new Error(response.data.message || 'Error al procesar la recarga.');

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const serverMessage = error.response.data?.message || 'Error en la recarga. Verifique la cantidad.';
            throw new Error(serverMessage);
        }
        throw new Error('Fallo en la conexión o el servidor no responde.');
    }
};

export const fetchUserPurchases = async(document: string) => {
    try {
        const response = await api.get<IStandardResponse<Purchase[]>>(API_ENDPOINTS.PURCHASES.GET_BY_DOCUMENT(document));

        if (response.data.statusCode === 200 && response.data.data) {
            return response.data.data;
        }

        throw new Error(response.data.message || 'Error al consultar la lista.');

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const serverMessage = error.response.data?.message || 'Error en la consulta de lista';
            throw new Error(serverMessage);
        }
        throw new Error('Fallo en la conexión o el servidor no responde.');
    }
}

export const startPayment = async (purchaseId: number, document: string) => {
    const payload = {
        purchaseId
    }

    try {
        const response = await api.patch<IStandardResponse<IStartPayment>>(API_ENDPOINTS.USERS.START_PAYMENT(document), payload);

        if (response.data.statusCode === 201 && response.data.data) {
            return response.data.data
        }

        throw new Error(response.data.message || 'Error al procesar la recarga.');

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const serverMessage = error.response.data?.message || 'Error en la recarga. Verifique la cantidad.';
            throw new Error(serverMessage);
        }
        throw new Error('Fallo en la conexión o el servidor no responde.');
    }
}

export const checkPayment = async (purchaseId: number, token: string) => {
    const payload = {
        purchaseId,
        token
    }

    try {
        const response = await api.patch<IStandardResponse<IStartPayment>>(API_ENDPOINTS.USERS.CHECK_PAYMENT, payload);

        if (response.data.statusCode === 201 && response.data.data) {
            return {
                data: response.data.data,
                message: response.data.message
            }
        }

        throw new Error(response.data.message || 'Error al procesar el pago.');
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const serverMessage = error.response.data?.message || 'Error al procesar el pago. Verifique la cantidad.';
            throw new Error(serverMessage);
        }
        throw new Error('Fallo en la conexión o el servidor no responde.');
    }
}
