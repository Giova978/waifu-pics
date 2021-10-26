import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://api.waifu.pics/",
});

const debounce = (func: Function, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: unknown[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};

export { axiosInstance as axios, debounce };
