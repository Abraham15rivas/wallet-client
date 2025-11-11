export const formatCurrency = (amount: number | null): string => {
    if (amount === null) return 'N/A';
    return amount.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2
    });
};