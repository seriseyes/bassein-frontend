import BaseDAO from "../../../utils/BaseDAO";

export class PrintDAO extends BaseDAO {
    async printBassein(dateFrom: string, dateTo: string) {
        return await this.get("/output/bassein?dateFrom=" + dateFrom + "&dateTo=" + dateTo);
    }

    getBasseinUrl(dateFrom: string, dateTo: string) {
        return "http://localhost:9000/api/output/bassein?dateFrom=" + dateFrom + "&dateTo=" + dateTo;
    }

    async printPerson(regNo: string) {
        return await this.get("http://localhost:9000/api/output/person?regNo=" + regNo);
    }

    getPersonUrl(regNo: string) {
        return "http://localhost:9000/api/output/person?regNo=" + regNo;
    }
}
