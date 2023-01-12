import {User} from "../views/users/models/UserModel";
import {Status} from "../enums/Status";

export interface Settings {
    name: string;
    label: string;
    note: string;
    value: number;
    has: boolean;
    status: Status;
    user?: User;
    created?: Date;
}
