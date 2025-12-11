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

    // const res = await axiosInstance.post(
    //     "/login", 
    //     params,
    //     {
    //         headers: {

    //         }, 
    //     },
    //     {skipAuth: true}
    // );
    //서버에서 내려준 값에 맞게 수정
    const { accessToken } = res.data;
    
    //AccessToken은 로컬스토리지에 저장
    localStorage.setItem("accessToken", accessToken);
    //refreshToken은 쿠키 기반이어서 저장하지 않는다.
    return res.data;
}