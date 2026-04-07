export interface Admission {
    id: string;
    patientId: string;
    admissionDateTime: string;
    admissionType: 'Rendez-vous' | 'Urgence' | 'Hospitalisation';
    reasonForAdmission: string;
    bedId?: string;
    status: 'Pending' | 'Admitted' | 'Discharged' | 'Completed' | 'Canceled';
    admittingUserId: string;
    dischargeDateTime?: string;
    createdAt: string;
    updatedAt: string;
}

// For data table display
export interface AdmissionWithPatient extends Admission {
    patientName?: string;
    patientGender?: 'Masculin' | 'Féminin' | 'Autre';
    patientDOB?: string;
}
