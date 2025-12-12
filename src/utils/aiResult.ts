// src/utils/aiResult.ts
import type { FashionRecommendResult } from "@/types/FashionRecommend";

/**
 * 백엔드에서 내려오는 aiResult를 유연하게 파싱하는 유틸
 * - String인 경우: ```json ... ``` 코드블록 껍데기 제거 후 JSON.parse 시도
 * - 객체인 경우: 그냥 FashionRecommendResult 라고 보고 반환
 * - 실패하면 null 반환
 */
export function parseAiResult(
  aiResult: unknown
): FashionRecommendResult | null {
  if (!aiResult) return null;

  // 이미 객체 형태로 온 경우
  if (typeof aiResult === "object") {
    return aiResult as FashionRecommendResult;
  }

  if (typeof aiResult === "string") {
    let text = aiResult.trim();

    // 1) ```json ... ``` 형태의 코드블록이면 안쪽만 추출
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch && fenceMatch[1]) {
      text = fenceMatch[1].trim();
    }

    // 2) 이제 JSON.parse 시도
    try {
      const parsed = JSON.parse(text) as FashionRecommendResult;

      // 최소한 summary + outfits는 있어야 유효한 결과로 봄
      if (!parsed.summary || !Array.isArray(parsed.outfits)) {
        return null;
      }

      return parsed;
    } catch (e) {
      console.error("❌ aiResult JSON 파싱 실패:", e);
      return null;
    }
  }

  return null;
}
