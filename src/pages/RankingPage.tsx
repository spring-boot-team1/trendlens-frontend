import { useEffect, useState } from "react";
import { trendApi } from "@/lib/api";
import type { TrendItem } from "@/types/trend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ 함수 선언과 동시에 export default를 해서 인식을 확실하게 만듭니다.
export default function RankingPage() {
  const [ranking, setRanking] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. 데이터 불러오기
  useEffect(() => {
    const loadRanking = async () => {
      try {
        const data = await trendApi.getGuestRanking();
        setRanking(data);
      } catch (error) {
        console.error("랭킹 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRanking();
  }, []);

  // 2. 카드 클릭 시 이동
  const handleCardClick = (keyword: string) => {
    navigate(`/insight?keyword=${keyword}`);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      {/* 상단 타이틀 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <TrendingUp className="text-blue-600" />
          🔥 실시간 급상승 트렌드
        </h1>
        <p className="text-slate-500">지금 가장 핫한 패션 키워드를 확인하세요.</p>
      </div>

      {/* 랭킹 리스트 */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">데이터를 불러오는 중...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ranking.map((item, index) => (
            <Card
              key={item.seqKeyword}
              className="hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-200"
              onClick={() => handleCardClick(item.keyword)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Badge variant={index < 3 ? "default" : "secondary"} className="text-sm">
                  {index + 1}위
                </Badge>
                <span className="text-xs text-slate-400">{item.category}</span>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">{item.keyword}</CardTitle>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-slate-500">Trend Score</span>
                  <span className="font-bold text-blue-600">
                    {item.trendScore.toLocaleString()}점
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}