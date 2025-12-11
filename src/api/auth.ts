import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/authStore";

export const login = async(email: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", email); //spring security 규칙
    params.append("password", password);

    //로그인 요청(x-www-form-urlencoded)
    const res = await axiosInstance.post(
        "/login",
        params, {
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded",
        },
        skipAuth:true,
    });

    //토큰 변수
    let accessToken = null;
    let claims: any = null;
    //accessToken: header에 위치
    const authHeader = res.headers["authorization"];
    
    if(authHeader) {
        //Authstore(zustand에 메모리 방식으로 저장)
        accessToken = authHeader.replace("Bearer ", "");
        claims = jwtDecode(accessToken);
        //Zustand와 localstorage에 각각 저장
        useAuthStore.getState().setAuth(accessToken, claims);
    } else {
        console.error("Auth header 없음. 백엔드 응답 확인 필요");
    }
    
    //refreshToken은 쿠키 기반이어서 저장하지 않는다.
    return { accessToken, claims };
}