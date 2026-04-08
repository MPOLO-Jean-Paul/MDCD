export interface Payment {
    id: string;
    invoiceId: string;
    patientId: string;
    paymentDate: string;
    amount: number;
    paymentMethod: 'Cash' | 'Mobile Money' | 'Credit Card' | 'Insurance Claim';
    transactionId?: string;
    receivedByUserId: string;
    status: 'Completed' | 'Pending' | 'Failed' | 'Refunded' | 'Disputed';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// For data table display
export interface PaymentWithDetails extends Payment {
    patientName?: string;
    receivedByUserName?: string;
}

    