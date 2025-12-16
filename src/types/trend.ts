// 백엔드의 TrendResponseDto와 일치
export interface TrendItem {
  seqKeyword: number;
  keyword: string;
  category: string;
  trendScore: number;
  rank?: number; // 랭킹 정보 (있을 수도 없을 수도 있음)
}

// 백엔드의 InsightResponseDto와 일치
export interface InsightResult {
  seqKeyword: number;
  keyword: string;
  category: string;
  summary: string;
  stylingTip: string | null;
  hasInsight: boolean;
}