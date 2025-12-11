import { useAuthStore } from "@/store/authStore";
import axiosInstance from "./axiosInstance";

export const login = async(email: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const res = await axiosInstance.post(
        "/login",
        params, {
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
        },
        skipAuth:true,
    });

    //accessToken: header에 위치
    const authHeader = res.headers["authorization"];
    
    if(authHeader) {
        //AccessToken은 로컬스토리지에 저장
        // localStorage.setItem("accessToken", accessToken);
        
        //Authstore(zustand에 메모리 방식으로 저장)
        const accessToken = authHeader.replace("Bearer ", "");
        useAuthStore.getState().setAccessToken(accessToken);
    } else {
        console.error("Auth header 없음. 백엔드 응답 확인 필요");
    }
    
    
    
    //refreshToken은 쿠키 기반이어서 저장하지 않는다.
    return res.data;
}