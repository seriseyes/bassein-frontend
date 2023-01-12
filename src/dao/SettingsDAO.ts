import BaseDAO from "../utils/BaseDAO";
import {Settings} from "../models/Settings";

export default class SettingsDAO extends BaseDAO {
    async save(settings: Settings) {
        return await super.post("/settings/save", settings);
    }

    async findAllByName(name: string) {
        return await super.get("/settings/all/name?name=" + name);
    }
}
