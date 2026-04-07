export interface Consultation {
    id: string;
    patientId: string;
    admissionId?: string;
    consultationDateTime: string;
    consultingDoctorId: string;
    symptoms: string;
    diagnosis: string;
    notes?: string;
    status: 'Completed' | 'Follow-up Required' | 'Draft';
    createdAt: string;
    updatedAt: string;
}

// For data table display, joining with Patient data
export interface ConsultationWithPatient extends Consultation {
    patientName: string;
}
