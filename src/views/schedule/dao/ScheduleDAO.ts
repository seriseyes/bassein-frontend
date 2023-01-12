import BaseDAO from "../../../utils/BaseDAO";
import {Schedule} from "../models/ScheduleModels";

export default class ScheduleDAO extends BaseDAO {

    async save(schedule: Schedule) {
        return await super.post("/schedule/save", schedule);
    }

    async markAsCame(scheduleId: number, start: string, end: string) {
        return await super.get("/schedule/came?came=" + scheduleId + "&start=" + start + "&end=" + end);
    }

    async cancelCame(timeTableId: number) {
        return await super.get("/schedule/cancel?timeTableId=" + timeTableId);
    }

    async findAllByCustomerRegNo(regNo: string) {
        return await super.get("/schedule/customer?regNo=" + regNo);
    }

    async findAllTodayTimeTable(start: string, end: string) {
        return await super.get("/schedule/today?start=" + start + "&end=" + end);
    }

    async findAllNowTime() {
        return await super.get("/schedule/now");
    }
}
