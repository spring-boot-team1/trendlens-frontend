import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
console.log("BASE_URL: " + import.meta.env.VITE_API_BASE_URL);

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    //timeout: 5000,
    withCredentials: true, //쿠키 기반 인증 시 필요함
});

//요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if(!config.skipAuth && token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

//응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // ❗ 재발급 API 오류일 경우 무한 루프 방지
    if (originalRequest.url.includes("/api/v1/reissue")) {
      return Promise.reject(error);
    }

    // 만료 401 + 아직 재시도 안함
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const reissueRes = await axiosInstance.post(
            "/api/v1/reissue",
            null, 
            { skipAuth: true }
        );

        //새 액세스토큰 추출
        const authHeader = reissueRes.headers["authorization"];
        if(!authHeader) throw new Error("Authorization header missing");
        
        const newToken = authHeader?.replace("Bearer ", "");
        const newClaims = jwtDecode(newToken);
        
        useAuthStore.getState().setAuth(newToken, newClaims);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        //기존 요청 재시도
        return axiosInstance(originalRequest);

      } catch (e) {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;