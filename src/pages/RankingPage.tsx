import { useEffect, useState } from "react";
import { trendApi } from "@/lib/api";
import type { TrendItem } from "@/types/trend";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, Crown, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function RankingPage() {
  const [ranking, setRanking] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const data = await trendApi.getGuestRanking();
        const sorted = [...data].sort((a, b) => b.trendScore - a.trendScore);
        setRanking(sorted);
      } catch (e) {
        console.error("랭킹 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    loadRanking();
  }, []);

  const goInsight = (keyword: string) => {
    navigate(`/insight?keyword=${encodeURIComponent(keyword)}`);
  };

  const top3 = ranking.slice(0, 3);
  const others = ranking.slice(3);

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          cardBg: "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/30",
          rankColor: "text-blue-200/80",
          icon: <Crown className="h-5 w-5 text-yellow-300 animate-pulse" fill="currentColor" />,
          badge: "bg-yellow-400 text-blue-900 hover:bg-yellow-300",
        };
      case 2:
        return {
          cardBg: "bg-white dark:bg-slate-800 border-blue-100 shadow-lg shadow-slate-200/50",
          rankColor: "text-slate-300",
          icon: <Sparkles className="h-4 w-4 text-slate-400" fill="currentColor" />,
          badge: "bg-slate-100 text-slate-600",
        };
      case 3:
        return {
          cardBg: "bg-white dark:bg-slate-800 border-blue-100 shadow-lg shadow-slate-200/50",
          rankColor: "text-slate-300",
          icon: <Sparkles className="h-4 w-4 text-slate-400" fill="currentColor" />,
          badge: "bg-slate-100 text-slate-600",
        };
      default:
        return { cardBg: "", rankColor: "", icon: null, badge: "" };
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-lg text-slate-500 animate-pulse">
          <TrendingUp className="h-6 w-6 text-blue-500" />
          데이터를 분석하고 있습니다...
        </div>
      </div>
    );
  }

  return (
    // ✅ py-12 -> py-8로 줄여 상하 여백 감소
    <div className="min-h-screen bg-slate-50/50 px-4 py-8 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-3 border-blue-200 bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium">
            <TrendingUp className="mr-1 h-3 w-3" /> 실시간 업데이트
          </Badge>
          {/* ✅ 폰트 크기 및 두께 감소 (text-4xl -> 3xl, font-extrabold -> bold) */}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              지금 뜨는 패션 키워드
            </span>
          </h1>
          {/* ✅ 폰트 크기 감소 (text-lg -> text-base) */}
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AI가 분석한 현재 가장 주목받는 트렌드 랭킹입니다.<br className="hidden sm:block"/> 
            키워드를 클릭하여 상세 분석 리포트를 확인하세요.
          </p>
        </div>

        {/* Top 3 Hero Section */}
        {ranking.length > 0 && (
          // ✅ 모바일에서 간격 감소 (gap-6 -> gap-4 md:gap-6)
          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 items-end">
            {top3[1] && (
              <TopRankCard
                item={top3[1]}
                rank={2}
                styles={getRankStyle(2)}
                onClick={goInsight}
                className="md:order-1 md:scale-95"
              />
            )}
            {top3[0] && (
              <TopRankCard
                item={top3[0]}
                rank={1}
                styles={getRankStyle(1)}
                onClick={goInsight}
                className="md:order-2 z-10 md:-mt-8"
                isNumberOne
              />
            )}
            {top3[2] && (
              <TopRankCard
                item={top3[2]}
                rank={3}
                styles={getRankStyle(3)}
                onClick={goInsight}
                className="md:order-3 md:scale-95"
              />
            )}
          </div>
        )}

        {/* 나머지 랭킹 리스트 (4위~) */}
        {others.length > 0 && (
          <Card className="border-none shadow-xl shadow-slate-200/60 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 dark:shadow-none overflow-hidden rounded-3xl">
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {others.map((item, index) => {
                  const actualRank = index + 4;
                  return (
                    <button
                      key={item.seqKeyword}
                      onClick={() => goInsight(item.keyword)}
                      // ✅ 패딩 감소로 모바일에서 더 컴팩트하게 (px-6 py-5 -> px-4 py-3)
                      className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-all hover:bg-blue-50/50 dark:hover:bg-slate-700/50 sm:px-6 sm:py-4"
                    >
                      {/* ✅ 순위 박스 크기 및 폰트 감소 (h-10 w-10 text-lg -> h-8 w-8 text-base) */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-slate-700 dark:text-slate-400 sm:h-10 sm:w-10 sm:text-lg">
                        {actualRank}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {/* ✅ 키워드 폰트 및 두께 감소 (text-lg font-semibold -> text-base font-medium) */}
                          <h3 className="truncate text-base font-medium text-slate-900 group-hover:text-blue-700 dark:text-white sm:text-lg sm:font-semibold">
                            {item.keyword}
                          </h3>
                        </div>
                          {/* ✅ 카테고리 폰트 감소 (text-sm -> text-xs) */}
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 sm:text-sm sm:mt-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {item.category ?? "미분류"}
                          </p>
                      </div>
                      <div className="shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-blue-500">
                         <ArrowRight className="h-5 w-5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {ranking.length === 0 && !loading && (
            <div className="text-center py-24 text-slate-400 bg-white rounded-3xl shadow-sm">
                표시할 데이터가 없습니다.
            </div>
        )}
      </div>
    </div>
  );
}

interface TopRankCardProps {
  item: TrendItem;
  rank: number;
  styles: any;
  onClick: (keyword: string) => void;
  className?: string;
  isNumberOne?: boolean;
}

function TopRankCard({ item, rank, styles, onClick, className, isNumberOne }: TopRankCardProps) {
  return (
    <button
      onClick={() => onClick(item.keyword)}
      // ✅ 모바일 패딩 감소 (p-6 -> p-4 sm:p-6)
      className={cn(
        "relative w-full overflow-hidden rounded-[2rem] p-4 sm:p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
        styles.cardBg,
        className
      )}
    >
      {/* ✅ 배경 숫자 크기 감소 (text-[8rem] -> text-[6rem]) */}
      <div
        className={cn(
          "absolute -right-2 -top-4 select-none text-[5rem] sm:text-[6rem] font-black leading-none opacity-20",
          styles.rankColor
        )}
      >
        {rank}
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between gap-3 sm:gap-4">
        <div className="flex items-start justify-between">
          {/* ✅ 뱃지 크기 감소 (text-sm -> text-xs) */}
          <Badge className={cn("px-2.5 py-0.5 text-xs font-semibold border-0 sm:text-sm sm:px-3 sm:py-1", styles.badge)}>
            {rank}위 {isNumberOne && "🔥"}
          </Badge>
          {styles.icon}
        </div>

        <div>
          {/* ✅ 카테고리 폰트 감소 (text-sm -> text-xs) */}
          <div className={cn("text-xs sm:text-sm mb-1 sm:mb-2 opacity-80 flex items-center gap-1", isNumberOne ? "text-blue-100" : "text-slate-500")}>
             {item.category ?? "Key Trend"}
          </div>
          {/* ✅ 키워드 폰트 및 두께 감소 */}
          <h3 className={cn("font-semibold leading-tight line-clamp-2 sm:font-bold", isNumberOne ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl text-slate-900")}>
            {item.keyword}
          </h3>
        </div>

        {/* ✅ 하단 스코어 영역 폰트 및 패딩 감소 */}
        {isNumberOne && (
          <div className="mt-1 inline-flex items-center text-xs font-medium text-blue-100/80 bg-blue-800/30 px-2.5 py-1 rounded-full w-fit sm:text-sm sm:px-3 sm:py-1.5 sm:mt-2">
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
            트렌드 지수 {item.trendScore.toLocaleString()}
          </div>
        )}
         {!isNumberOne && (
          <div className="mt-1 inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full w-fit sm:text-sm sm:px-3 sm:py-1.5 sm:mt-2">
            Score {item.trendScore.toLocaleString()}
          </div>
        )}
      </div>
    </button>
  );
}