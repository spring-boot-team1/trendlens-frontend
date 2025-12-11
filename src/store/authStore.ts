import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  username: string | null;
  role: string | null;
  email: string | null;
  profilepic: string | null;
  seqAccount: number | null;
  seqAccountDetail: number | null;

  setAuth: (token: string, claims: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({

  accessToken: localStorage.getItem("accessToken") || null,
  username: localStorage.getItem("username") || null,
  role: localStorage.getItem("role") || null,
  email: localStorage.getItem("email") || null,
  profilepic: localStorage.getItem("profilepic") || null,
  seqAccount: localStorage.getItem("seqAccount") 
    ? Number(localStorage.getItem("seqAccount")) : null,
  seqAccountDetail: localStorage.getItem("seqAccountDetail")
    ? Number(localStorage.getItem("seqAccountDetail")) : null,

  setAuth: (token, claims) => {

    // Token 저장
    localStorage.setItem("accessToken", token);

    // Claims 저장/삭제
    claims.username
      ? localStorage.setItem("username", claims.username)
      : localStorage.removeItem("username");

    claims.role
      ? localStorage.setItem("role", claims.role)
      : localStorage.removeItem("role");

    claims.email
      ? localStorage.setItem("email", claims.email)
      : localStorage.removeItem("email");

    claims.profilepic
      ? localStorage.setItem("profilepic", claims.profilepic)
      : localStorage.removeItem("profilepic");

    claims.seqAccount
      ? localStorage.setItem("seqAccount", String(claims.seqAccount))
      : localStorage.removeItem("seqAccount");

    claims.seqAccountDetail
      ? localStorage.setItem("seqAccountDetail", String(claims.seqAccountDetail))
      : localStorage.removeItem("seqAccountDetail");

    // Zustand 업데이트
    set({
      accessToken: token,
      username: claims.username ?? null,
      role: claims.role ?? null,
      email: claims.email ?? null,
      profilepic: claims.profilepic ?? null,
      seqAccount: claims.seqAccount ?? null,
      seqAccountDetail: claims.seqAccountDetail ?? null,
    });
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("profilepic");
    localStorage.removeItem("seqAccount");
    localStorage.removeItem("seqAccountDetail");

    set({
      accessToken: null,
      username: null,
      role: null,
      email: null,
      profilepic: null,
      seqAccount: null,
      seqAccountDetail: null,
    });
  },
}));
