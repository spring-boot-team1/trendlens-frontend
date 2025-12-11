import axios from "axios";
const API = import.meta.env.VITE_BACKEND_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API,
    timeout: 5000,
    withCredentials: true, //쿠키 기반 인증 시 필요함
});

//요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        //401 처리, refreshtoken으로 access토큰 재발급 로직 넣기 좋음
        if(error.response?.status === 401) {
            console.log("Access Token expired. Try refreshing token...");
            //refresh 로직 구현 필요 TODO
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;