import axios from 'axios';

const AxiosInstance = axios.create({
    baseURL: "http://localhost:9000/api",
    withCredentials: true,
});

export default AxiosInstance;
