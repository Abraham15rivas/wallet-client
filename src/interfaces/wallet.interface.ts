export interface Purchase {
    id: number;
    token: string | null;
    amount: string;
    product: string;
    status: 'ACTIVE' | 'FINISHED';
    expiresAt: string | null;
    userDocument: string;
}

export interface IBalanceResponse {
    balance: number;
}

export interface ITopUpRequest {
    amount: number;
    phone: string;
    document: string;
}

export interface IBalanceRequest {
    phone: string;
    document: string;
}

export interface ITopUpResponse {
    document: string;
    newBalance: number;
}

export interface PurchaseState {
    purchases: Purchase[];
    loading: boolean;
    error: string | null;
}

export interface ModalState {
    show: boolean;
    purchaseId: number | null;
    tokenInput: string;
    loading: boolean;
    message: string | null;
}

export interface IStartPayment {
    purchaseId: number;
    document: string;
}
