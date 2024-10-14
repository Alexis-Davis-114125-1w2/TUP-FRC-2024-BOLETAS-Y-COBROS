
export interface PaymentReceipt {
    id: number;
    paymentId: string;
    status: string;
    transactionAmount: number;
    paymentMethod: string;
    paymentType: string;
    merchantOrderId: string;
    externalReference: string
    dateCreated: string; //datetime
    dateApproved?: string; //datetime
    metadata : string;
}