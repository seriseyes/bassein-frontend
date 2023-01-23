import {Customer, User} from "../models/UserModel";
import BaseDAO from "../../../utils/BaseDAO";

export default class UserDAO extends BaseDAO {

    async findAllUser() {
        return await super.get("/user/all");
    }

    async saveUser(user: User) {
        return await super.post("/user/save", user);
    }

    async findAllCustomer() {
        return await super.get("/user/customer/all");
    }

    async findAllCustomerByRegNo(regNo: string) {
        return await super.get("/user/customer/like/regNo?regNo=" + regNo);
    }

    async findCustomerByRegNo(regNo: string) {
        return await super.get("/user/customer/regNo?regNo=" + regNo);
    }

    async saveCustomer(customer: Customer) {
        return await super.post("/user/customer/save", customer);
    }

    async findAllTeacher() {
        return await super.get("/user/all/teacher");
    }

    async existByRegNo(regNo: string) {
        return await super.get("/user/exist/regNo?regNo=" + regNo);
    }

    async resetPassword(username: string, newPassword: string) {
        return await super.get("/user/reset/password?username=" + username + "&newPassword=" + newPassword);
    }
}
