import axiosInstance from "@/api/axiosInstance"; 
import type { TrendItem, InsightResult } from "@/types/trend";

export const trendApi = {
  // 1. 게스트용 Top 5 랭킹 조회
  getGuestRanking: async (): Promise<TrendItem[]> => {
    const response = await axiosInstance.get<TrendItem[]>("/rank/guest");
    return response.data;
  },

  // 2. 키워드 검색 & Insight 조회
  searchInsight: async (keyword: string): Promise<InsightResult[]> => {
    const response = await axiosInstance.get<InsightResult[]>("/insight", {
      params: { keyword },
    });
    return response.data;
  },

  // 3. [회원용] 내 관심 키워드 랭킹 조회 (하트 누른 것들의 랭킹)
  getMyRanking: async (seqAccount: number): Promise<TrendItem[]> => {
    const response = await axiosInstance.get<TrendItem[]>("/api/trends/rank/my", {
      params: { seqAccount }
    });
    return response.data;
  }, 

  // 4. [기능] 하트 클릭 (관심 키워드 등록/해제 토글)
  toggleInterest: async (seqAccount: number, seqKeyword: number) => {
    const response = await axiosInstance.post("/api/v1/interests/toggle", null, {
      params: { seqAccount, seqKeyword }
    });
    return response.data;
  },

  // 5. [확인] 상세 페이지 진입 시, 내가 이미 하트를 눌렀는지 확인
  checkIsLiked: async (seqAccount: number, seqKeyword: number): Promise<boolean> => {
    try {
      const response = await axiosInstance.get<TrendItem[]>("/api/v1/interests/my", {
        params: { seqAccount }
      });
      const myInterests = response.data;
      // 내 관심 목록(myInterests) 중에 현재 키워드(seqKeyword)가 있는지 확인
      return myInterests.some((item) => item.seqKeyword === seqKeyword);
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};