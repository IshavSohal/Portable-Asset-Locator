type user = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'Custodian' | 'Base';
};

export type { user }