export interface Patient {
    id: string;
    firstName: string;
    lastName:string;
    dateOfBirth: string;
    gender: string;
    address?: string;
    phone?: string;
    email?: string;
    bloodGroup?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    insurancePolicyNumber?: string;
    insuranceProviderId?: string;
    createdAt: string;
    updatedAt: string;
}
