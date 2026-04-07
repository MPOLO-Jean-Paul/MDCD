export interface Medication {
    id: string;
    name: string;
    description: string;
    unitOfMeasure: string;
    strength?: string;
    manufacturer?: string;
    isActive: boolean;
    unitPrice: number;
    reorderLevel: number;
    createdAt: string;
    updatedAt: string;
}

export interface StockItem {
    id: string;
    medicationId: string;
    batchNumber: string;
    expirationDate: string;
    currentQuantity: number;
    location?: string;
    lastUpdateUserId: string;
    lastUpdateDateTime: string;
    createdAt: string;
    updatedAt: string;
}

// For data table display, joining StockItem with Medication
export interface StockItemWithMedication extends StockItem {
    medicationName: string;
    reorderLevel: number;
    unitPrice: number;
}
