import {Customer, User} from "../models/UserModel";
import BaseDAO from "../../../utils/BaseDAO";

export default class UserDAO extends BaseDAO {

    public async findAllUser() {
        return await super.get("/user/all");
    }

    public async saveUser(user: User) {
        return await super.post("/user/save", user);
    }

    public async findAllCustomer() {
        return await super.get("/user/customer/all");
    }

    public async findAllCustomerByRegNo(regNo: string) {
        return await super.get("/user/customer/like/regNo?regNo=" + regNo);
    }

    public async findCustomerByRegNo(regNo: string) {
        return await super.get("/user/customer/regNo?regNo=" + regNo);
    }

    public async saveCustomer(customer: Customer) {
        return await super.post("/user/customer/save", customer);
    }

}
