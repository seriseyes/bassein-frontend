import BaseDAO from "../../../utils/BaseDAO";
import {ScheduleDto} from "../models/ScheduleModels";

export default class ScheduleDAO extends BaseDAO {

    public async save(schedule: ScheduleDto) {
        return await super.post("/schedule/save", schedule);
    }

    public async findWeekSchedule() {
        return await super.get("/schedule/week");
    }

    public async markAsCame(scheduleId: number) {
        return await super.get("/schedule/came?came=" + scheduleId);
    }

    public async findAllByCustomerRegNo(regNo: string) {
        return await super.get("/schedule/customer?regNo=" + regNo);
    }
}
