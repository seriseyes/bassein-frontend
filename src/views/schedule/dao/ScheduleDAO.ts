import BaseDAO from "../../../utils/BaseDAO";
import {ScheduleDto} from "../models/ScheduleModels";

export default class ScheduleDAO extends BaseDAO {

    public async save(schedule: ScheduleDto) {
        return await super.post("/schedule/save", schedule);
    }

    public async findWeekSchedule() {
        return await super.get("/schedule/week");
    }
}
