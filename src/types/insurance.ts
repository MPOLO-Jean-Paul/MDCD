export interface InsuranceProvider {
    id: string;
    name: string;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    address?: string;
    policyTerms?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
