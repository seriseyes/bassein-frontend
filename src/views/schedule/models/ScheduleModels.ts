import {Customer} from "../../users/models/UserModel";

export interface ScheduleDto {
    customers: Customer[];
    schedule: Schedule;
}

export interface Schedule {
    id?: number;
    customer?: Customer;
    day: number;
    enter: number;
    enterDates: Date[];
    plans: TimePer[];
    created?: Date;
}

export interface TimePer {
    time: string;
    week: number;
}
