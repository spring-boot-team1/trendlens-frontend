// src/components/bodyAnalyzeInc/FashionRecommendBox.tsx

import { Ring90Icon } from "@/components/ui/icons/Ring90Icon";
import type { BodyAnalysisResponse } from "@/types/BodyAnalysisResponse";
import { parseAiResult } from "@/utils/aiResult";
import type { FashionRecommendResult } from "@/types/FashionRecommend";

type FashionRecommendBoxProps = {
  data: BodyAnalysisResponse | null;
  isLoading: boolean;
};

export default function FashionRecommendBox({
  data,
  isLoading,
}: FashionRecommendBoxProps) {
  // 원본 AI 결과 (문자열일 수도, 객체일 수도 있음)
  const rawAi = data?.aiResult ?? null;

  // JSON 구조로 파싱 시도
  const parsed: FashionRecommendResult | null = parseAiResult(rawAi as any);

  // 결과 유무 플래그 (파싱 성공 or 최소한 텍스트라도 있는 경우)
  const hasResult = !!parsed || (!!rawAi && typeof rawAi === "string");

  // 디버깅용 (원하면 한번 켜두고 확인해도 좋음)
  // console.log("🔍 aiResult raw:", rawAi);
  // console.log("🔍 aiResult parsed:", parsed);

  return (
    <div className="relative w-[520px] h-[750px] rounded-3xl bg-white border border-gray-200 p-6 flex flex-col">
      {/* 헤더 영역 */}
      <div className="mb-4">
        <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide">
          TrendLens AI
        </p>
        <h2 className="mt-1 text-xl font-bold text-gray-900">
          체형 기반 스타일 추천
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          업로드한 전신 사진과 체형 분석 데이터를 바탕으로
          <br />
          잘 어울리는 핏과 코디 조합을 제안해 드립니다.
        </p>
      </div>

      {/* 측정 요약 (키/몸무게/BMI) */}
      {data && (
  <>
    {/* 1라인: 키 / 몸무게 / BMI */}
    <div className="mb-2 grid grid-cols-3 gap-2 text-xs text-gray-700">
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-400">키</span>
        <span className="font-semibold">
          {data.heightCm}
          <span className="ml-0.5 text-[11px] text-gray-500">cm</span>
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-400">몸무게</span>
        <span className="font-semibold">
          {data.weightKg}
          <span className="ml-0.5 text-[11px] text-gray-500">kg</span>
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-400">BMI</span>
        <span className="font-semibold">{data.bmi}</span>
      </div>
    </div>

    {/* 2라인: 세부 체형 메트릭스 */}
    <div className="mb-1 grid grid-cols-4 gap-2 text-[11px] text-gray-700">
      <div className="flex flex-col">
        <span className="text-[9px] text-gray-400">어깨 너비</span>
        <span className="font-semibold">
          {data.shoulderWidthCm}
          <span className="ml-0.5 text-[10px] text-gray-500">cm</span>
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] text-gray-400">팔 길이</span>
        <span className="font-semibold">
          {data.armLengthCm}
          <span className="ml-0.5 text-[10px] text-gray-500">cm</span>
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] text-gray-400">다리 길이</span>
        <span className="font-semibold">
          {data.legLengthCm}
          <span className="ml-0.5 text-[10px] text-gray-500">cm</span>
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] text-gray-400">상체 길이</span>
        <span className="font-semibold">
          {data.torsoLengthCm}
          <span className="ml-0.5 text-[10px] text-gray-500">cm</span>
        </span>
      </div>
    </div>

    {/* 오차 안내 문구 */}
    <p className="mb-3 text-[10px] text-gray-400">
      * 3D 추정값을 기반으로 한 계산으로, 실제 실측과 약간의 오차가 있을 수 있으며
      <br />
      정확한 치수라기보다는 참고용 수치입니다.
    </p>
  </>
)}

      {/* 구분선 */}
      <div className="h-px bg-gray-100 mb-4" />

      {/* 내용 영역 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {/* 아직 결과 없을 때 */}
        {!hasResult && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-xs text-gray-400 text-center px-4">
            <p>왼쪽에서 전신 사진과 기본 정보를 입력한 뒤</p>
            <p>&ldquo;체형 측정하기&rdquo; 버튼을 눌러주세요.</p>
            <p className="mt-2">
              분석이 완료되면 이 영역에{" "}
              <span className="font-semibold text-gray-500">
                스타일 요약과 코디 추천
              </span>
              이 표시됩니다.
            </p>
          </div>
        )}

        {/* ✅ 1단계: JSON 파싱 성공한 경우 → summary + 코디 카드 UI */}
        {parsed && (
          <>
            {/* 요약 */}
            <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed bg-gray-50 rounded-2xl p-3">
              {parsed.summary}
            </div>

            {/* 코디 카드들 */}
            {parsed.outfits.map((outfit, index) => (
              <div
                key={outfit.name + index}
                className="border border-gray-100 rounded-2xl p-3 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
              >
                {/* 타이틀 + 키워드 */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {outfit.name}
                    </h3>
                    {outfit.styleKeywords?.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {outfit.styleKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-[2px] text-[10px] font-medium text-indigo-600"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 디테일 */}
                <div className="mt-2 space-y-2 text-xs text-gray-700">
                  {/* 상의 */}
                  {outfit.top && (
                    <div>
                      <span className="font-semibold text-[11px] text-gray-500">
                        상의
                      </span>
                      <div className="mt-0.5">
                        <p className="font-medium">{outfit.top.item}</p>
                        <p className="text-[11px] text-gray-500">
                          {outfit.top.size && (
                            <>
                              사이즈: {outfit.top.size}
                              {" · "}
                            </>
                          )}
                          {outfit.top.fit && <>핏: {outfit.top.fit}</>}
                        </p>
                        {outfit.top.comment && (
                          <p className="mt-0.5 text-[11px] text-gray-600">
                            {outfit.top.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 하의 */}
                  {outfit.bottom && (
                    <div>
                      <span className="font-semibold text-[11px] text-gray-500">
                        하의
                      </span>
                      <div className="mt-0.5">
                        <p className="font-medium">{outfit.bottom.item}</p>
                        <p className="text-[11px] text-gray-500">
                          {outfit.bottom.size && (
                            <>
                              사이즈: {outfit.bottom.size}
                              {" · "}
                            </>
                          )}
                          {outfit.bottom.fit && <>핏: {outfit.bottom.fit}</>}
                        </p>
                        {outfit.bottom.comment && (
                          <p className="mt-0.5 text-[11px] text-gray-600">
                            {outfit.bottom.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 아우터 */}
                  {outfit.outer && (
                    <div>
                      <span className="font-semibold text-[11px] text-gray-500">
                        아우터
                      </span>
                      <div className="mt-0.5">
                        <p className="font-medium">{outfit.outer.item}</p>
                        <p className="text-[11px] text-gray-500">
                          {outfit.outer.size && (
                            <>
                              사이즈: {outfit.outer.size}
                              {" · "}
                            </>
                          )}
                          {outfit.outer.fit && <>핏: {outfit.outer.fit}</>}
                        </p>
                        {outfit.outer.comment && (
                          <p className="mt-0.5 text-[11px] text-gray-600">
                            {outfit.outer.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 신발 */}
                  {outfit.shoes && (
                    <div>
                      <span className="font-semibold text-[11px] text-gray-500">
                        신발
                      </span>
                      <div className="mt-0.5">
                        <p className="font-medium">{outfit.shoes.item}</p>
                        {outfit.shoes.size && (
                          <p className="text-[11px] text-gray-500">
                            사이즈: {outfit.shoes.size}
                          </p>
                        )}
                        {outfit.shoes.comment && (
                          <p className="mt-0.5 text-[11px] text-gray-600">
                            {outfit.shoes.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 액세서리 */}
                  {outfit.accessories && outfit.accessories.length > 0 && (
                    <div>
                      <span className="font-semibold text-[11px] text-gray-500">
                        액세서리
                      </span>
                      <ul className="mt-0.5 space-y-1">
                        {outfit.accessories.map((acc, idx) => (
                          <li
                            key={acc.item + idx}
                            className="text-[11px] text-gray-600"
                          >
                            <span className="font-medium">{acc.item}</span>
                            {acc.comment && <> — {acc.comment}</>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ✅ 2단계: JSON 파싱은 실패했지만, 걍 긴 텍스트라도 있을 때 */}
        {!parsed && rawAi && typeof rawAi === "string" && (
          <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed bg-gray-50 rounded-2xl p-3">
            {rawAi}
          </div>
        )}
      </div>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70 rounded-3xl">
          <Ring90Icon size={40} color="#4B5563" strokeWidth={1.6} />
          <span className="text-xs text-gray-500">
            체형을 분석하고 스타일을 추천하는 중입니다...
          </span>
        </div>
      )}
    </div>
  );
}
