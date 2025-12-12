import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trendApi } from "@/lib/api";
import type { InsightResult } from "@/types/trend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

// ✅ 함수 선언과 동시에 export default 적용 (import 에러 방지)
export default function InsightPage() {
  // 1. 주소창에서 'keyword'를 꺼냅니다.
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  // 2. 화면에 보여줄 데이터들을 기억할 공간(State)을 만듭니다.
  const [results, setResults] = useState<InsightResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 3. 페이지가 켜지거나, 검색어(keyword)가 바뀌면 실행되는 함수
  useEffect(() => {
    if (!keyword) {
      setLoading(false); // 키워드가 없으면 로딩 해제
      return; 
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // 백엔드에게 "이 키워드로 찾아줘!" 라고 요청
        const data = await trendApi.searchInsight(keyword);
        setResults(data);
      } catch (err) {
        console.error(err);
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false); // 로딩 끝
      }
    };

    fetchData();
  }, [keyword]);

  // 4. 화면 그리기 시작!
  return (
    <div className="container mx-auto py-10 px-4">
      {/* 제목 영역 */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🔍 <span className="text-blue-600">"{keyword}"</span> 분석 리포트
        </h1>
        <p className="text-slate-500 mt-1">
          Gemini AI가 분석한 트렌드 요약과 스타일링 팁입니다.
        </p>
      </div>

      {/* 로딩 중일 때 보여줄 화면 */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-slate-500">AI가 데이터를 분석 중입니다...</span>
        </div>
      )}

      {/* 에러 났을 때 보여줄 화면 */}
      {!loading && error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* 결과가 없을 때 */}
      {!loading && !error && results.length === 0 && (
        <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-lg">
          검색 결과가 없습니다. 다른 검색어를 입력해보세요.
        </div>
      )}

      {/* ★ 진짜 결과 리스트 보여주는 곳 ★ */}
      <div className="space-y-6">
        {results.map((item) => (
          <Card key={item.seqKeyword} className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-slate-50/50 pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs bg-white">
                      {item.category}
                    </Badge>
                    {/* 분석 여부에 따라 다른 뱃지 보여주기 */}
                    {item.hasInsight ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                        <Sparkles className="w-3 h-3 mr-1" /> AI 분석완료
                      </Badge>
                    ) : (
                      <Badge variant="secondary">분석 대기중</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{item.keyword}</CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* AI 요약 내용 */}
              <div>
                <h4 className="font-semibold text-sm text-slate-900 mb-1 flex items-center gap-2">
                  📊 트렌드 요약
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md">
                  {item.summary}
                </p>
              </div>

              {/* 스타일링 팁 (데이터가 있을 때만 보여줌) */}
              {item.stylingTip && (
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 mb-1 flex items-center gap-2">
                    👗 스타일링 팁
                  </h4>
                  <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-md border border-blue-100">
                    💡 {item.stylingTip}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}