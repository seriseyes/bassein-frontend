import axios from "../../../utils/AxiosInstance";
import {TokenDto} from "../models/AuthModels";

export async function login(username: string, password: string) {
    const request = await axios.post<TokenDto>("/auth/login", {username, password});
    return request.data;
}
