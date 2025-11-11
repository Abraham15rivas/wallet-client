export interface IUser {
    document: string;
    phone: string;
    email: string;
    names: string;
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IRegisterData extends ILoginCredentials {
    phone: string;
    names: string;
    document: string;
    email: string;
}

export interface IStandardResponse<T> {
    statusCode: number;
    message: string;
    data: T | null;
}

export interface IAuthData {
    access_token: string;
    user: IUser;
}