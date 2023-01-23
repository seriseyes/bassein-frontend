import axios from "./AxiosInstance";
import {Response, State} from "../models/Response";
import {toast} from "react-toastify";
import {AxiosError} from "axios";

abstract class BaseDAO {

    public async post<T>(url: string, model: T): Promise<Response> {
        try {
            const response = await axios.post<Response>(url, model, getHeader());
            handleResponse(response.data, "POST");
            return response.data;
        } catch (err: any) {
            handleError(err);
        }
        return {message: "Алдаа гарлаа", state: State.ERROR, data: {}}
    }

    public async get<T>(url: string): Promise<Response> {
        try {
            const response = await axios.get<Response>(url, getHeader());
            handleResponse(response.data);
            return response.data;
        } catch (err: any) {
            handleError(err);
        }
        return {message: "Алдаа гарлаа", state: State.ERROR, data: {}}
    }
}

function getHeader() {
    return {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
}

function handleResponse(response: Response, method: string = "GET") {
    if (response.state !== State.SUCCESS) {
        toast.error(response.message, {toastId: response.message});
    } else if (method === 'POST') {
        toast.success(response.message, {toastId: response.message});
    }
}

function handleError(err: AxiosError) {
    if (!err.response) {
        toast.error("Тодорхойгүй алдаа гарлаа [console]");
        console.error(err);
        return;
    }

    switch (err.response.status) {
        case 401:
            toast.info("Дахин нэвтэрнэ үү.");
            window.location.href = "/";
            return;
    }
    toast.error(err.message);
}


export default BaseDAO;
