export interface Invoice {
    id: string;
    patientId: string;
    admissionId?: string;
    invoiceDate: string;
    dueDate: string;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    status: 'Pending' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled';
    generatedByUserId: string;
    createdAt: string;
    updatedAt: string;
}

// For data table display
export interface InvoiceWithPatient extends Invoice {
    patientName?: string;
}
