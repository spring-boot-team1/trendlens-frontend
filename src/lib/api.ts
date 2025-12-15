import axios from "axios";
import type { TrendItem, InsightResult } from "../types/trend";

// 백엔드 주소 설정 (CORS 설정이 백엔드에 되어있어야 함)
const api = axios.create({
  baseURL: "http://localhost:8080/trend/api/trends",
  withCredentials: true
});

export const trendApi = {
  // 1. 게스트용 Top 5 랭킹 조회
  getGuestRanking: async (): Promise<TrendItem[]> => {
    const response = await api.get<TrendItem[]>("/rank/guest");
    return response.data;
  },

  // 2. 키워드 검색 & Insight 조회
  searchInsight: async (keyword: string): Promise<InsightResult[]> => {
    const response = await api.get<InsightResult[]>("/insight", {
      params: { keyword },
    });
    return response.data;
  },
};