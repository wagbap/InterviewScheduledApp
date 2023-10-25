// doctor.model.ts

export interface Doctor {
    user: {
        userId: number;
        fullName: string;
        // ... other user properties ...
    };
    // ... other doctor properties ...
}

export interface DoctorModel {
    // propriedades...
    userId?: number;
    fullName: string;
    email: string;
    password: string;
    userType?: string;
    creationDate?: Date;
    // Outros campos relevantes...
}
