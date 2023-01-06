export interface User {
    id?: number;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    status: string;
    role: string;
    created?: Date;
}

export interface Customer {
    id?: number;
    firstname: string;
    lastname: string;
    regNo: string;
    status: string;
    created?: Date;
}
