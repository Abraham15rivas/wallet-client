import axios from 'axios';
import type { ILoginCredentials, IRegisterData, IUser, IStandardResponse, IAuthData } from '../interfaces/auth.interface';
import api from '../api/api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

type AuthResponseType = IStandardResponse<IAuthData>;

export const loginUser = async (credentials: ILoginCredentials): Promise<IUser> => {
    try {
        const response = await api.post<AuthResponseType>(API_ENDPOINTS.AUTH.LOGIN, credentials);

        if (response.data.statusCode === 200 && response.data.data?.access_token) {
            const { access_token, user } = response.data.data;
            localStorage.setItem('userToken', access_token);
            localStorage.setItem('user', JSON.stringify(user))
            return user;
        }

        throw new Error(response.data.message || 'Error de datos al iniciar sesión.');
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const serverMessage = error.response.data?.message || 'Email o contraseña incorrectos.';
            throw new Error(serverMessage);
        }

        throw new Error('Fallo en la conexión o el servidor no responde.');
    }
};

export const registerUser = async (userData: IRegisterData): Promise<IUser> => {
    try {
        const response = await api.post<IStandardResponse<IUser>>(API_ENDPOINTS.AUTH.REGISTER, userData);
        if (response.data.statusCode === 201 && response.data.data) {
            return response.data.data;
        }

        throw new Error(response.data.message || 'Error de datos al registrar el usuario.');

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const serverMessage = error.response.data?.message || 'Error al procesar el registro.';
            throw new Error(serverMessage);
        }
        throw new Error('Fallo en la conexión o el servidor no responde.');
    }
};