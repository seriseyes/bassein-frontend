export interface Weeks {
    monday: Week;
    tuesday: Week;
    wednesday: Week;
    thursday: Week;
    friday: Week;
    saturday: Week;
    sunday: Week;
}

export interface Week {
    day: Days;
    number: number;
    value: string;
}

export enum Days {
    monday = 'monday',
    tuesday = 'tuesday',
    wednesday = 'wednesday',
    thursday = 'thursday',
    friday = 'friday',
    saturday = 'saturday',
    sunday = 'sunday'
}
