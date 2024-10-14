export interface ExpenseInterface {
    id: number;
    ownerId : number;
    period: string;
    issueDate: Date;
    first_expiration_date: string;
    first_expiration_amount: number;
    second_expiration_date: string;
    second_expiration_amount: string
    payment_method: string;
    paymentId: string;
    status: string;
    selected?: boolean;
    paymentDate?: Date; 
    //status tipe : Pago, Pendiente, Exceptuado pero el exceptuado no lo uso
}
