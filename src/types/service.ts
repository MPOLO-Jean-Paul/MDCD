
export interface Service {
    id: string;
    name: string;
    description: string;
    unitPrice: number;
    category: string;
    responsibleUserId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// This interface will be used by the data table, after joining with user data
export interface ServiceWithUser extends Service {
    responsibleUserName?: string;
}
