import {Customer, User} from "../../users/models/UserModel";
import {Settings} from "../../../models/Settings";
import {Status} from "../../../enums/Status";

export interface Schedule {
    id?: number;
    customer?: Customer;
    day: number;
    enter: number;
    discount?: Settings;
    swimType?: Settings;
    teacher?: User;
    created?: Date;
}

export interface TimeTable {
    id?: number;
    schedule: Schedule;
    status: Status;
    time: string;
    start: Date;
    end: Date;
    locker: string;
}

export interface TimeTableDto {
    id?: number;
    fullname: string;
    age: number;
    gender: string;
    type: string;
    schedule: string;
    teacher: string;
    targetTime: string;
    day: string;
    timeTable: TimeTable;
}

export interface Day {
    start: string;
    end: string;
    label: string;
    close?: boolean;
}
