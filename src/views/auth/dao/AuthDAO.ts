import axios from "../../../utils/AxiosInstance";
import {TokenDto} from "../models/AuthModels";
import {toast} from "react-toastify";

export async function login(username: string, password: string) {
    try {
        const request = await axios.post<TokenDto>("/auth/login", {username, password});
        return request.data;
    } catch (e) {
        toast.error("Нэвтрэх нэр эсвэл нууц үг буруу байна.");
    }

}
