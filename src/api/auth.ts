import axiosInstance from "./axiosInstance";

export const login = async(email: string, password:string) => {
    const res = await axiosInstance.post(
        "/login",
        {email, password},
        {skipAuth: true}
    );
    //서버에서 내려준 값에 맞게 수정
    const { accessToken } = res.data;
    
    //AccessToken은 로컬스토리지에 저장
    localStorage.setItem("accessToken", accessToken);
    //refreshToken은 쿠키 기반이어서 저장하지 않는다.
    return res.data;
}