import { useEffect, useState } from "react";
import { trendApi } from "@/lib/api";
import { TrendingUp, TrendingDown, Minus, Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// ✅ 백엔드 데이터 타입 정의
interface TrendData {
  seqKeyword: number;
  keyword: string;
  category: string;
  trendScore: number;
  prevScore: number;
  growthRate: number;
  status: "up" | "down" | "stable";
  aiSummary?: string;
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const data = await trendApi.getGuestRanking();
        
        if (!data || !Array.isArray(data)) {
            setRanking([]);
            return;
        }

        // 1. 점수순 정렬
        const sorted = data.sort((a: any, b: any) => b.trendScore - a.trendScore);

        // 2. 🚨 가짜 상승률/지난주 점수 랜덤 생성 (사용자가 요청한 로직 유지)
        const processed = sorted.map((item: any) => {
          // 이미 백엔드에 데이터가 있으면 그거 쓰고, 없으면 랜덤 생성
          if (item.growthRate !== undefined && item.prevScore !== undefined) return item;

          const fluctuation = Math.random() * 0.4 + 0.8; // 0.8 ~ 1.2 배수
          const prevScore = Math.floor(item.trendScore * fluctuation);
          const growthRate = prevScore === 0 ? 100 : Math.round(((item.trendScore - prevScore) / prevScore) * 100);
          
          let status: "up" | "down" | "stable" = "stable";
          if (growthRate > 0) status = "up";
          else if (growthRate < 0) status = "down";

          return { ...item, prevScore, growthRate, status };
        });
        
        setRanking(processed);
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

  // 상승률 표시 헬퍼 함수
  const getGrowthDisplay = (rate: number) => {
    if (!rate || rate === 0) {
        return { text: "0%", color: "text-gray-400", bg: "bg-gray-400" };
    }
    if (rate > 0) {
      return { text: `+${rate}%`, color: "text-red-600", bg: "bg-red-600" };
    } else {
      return { text: `${rate}%`, color: "text-blue-600", bg: "bg-blue-600" };
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="text-xl font-serif italic text-black animate-pulse">
        TrendLens Loading...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black pb-20">
      <div className="mx-auto max-w-screen-xl px-5 md:px-8">
        
        {/* [헤더] 여백 수정됨 (pt-12->6, pb-8->4, mb-10->6) */}
        <div className="pt-6 pb-4 border-b-2 border-black mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-normal tracking-tight text-black mb-1 leading-tight">
                Weekly Trend
              </h1>
              <p className="font-sans text-sm text-gray-500 font-medium mt-2 flex items-center gap-2">
                <span className="text-black font-semibold">{new Date().toLocaleDateString()} 기준</span>
                <span className="w-0.5 h-3 bg-gray-300"></span>
                <span>실시간 패션 키워드 랭킹</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto pb-1">
              <div className="relative group w-full md:w-64">
                <input 
                  type="text" 
                  placeholder="SEARCH KEYWORD" 
                  className="w-full bg-transparent border-b border-gray-300 py-2 pr-8 pl-1 text-xs font-bold outline-none focus:border-black transition-colors placeholder:text-gray-300 rounded-none font-sans tracking-wide"
                />
                <Search className="absolute right-0 top-2 h-4 w-4 text-black opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* [메인 컨텐츠] */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          {/* [좌측] Top 3 Keywords */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-5 border-b border-black pb-3">
              <h2 className="text-sm font-bold tracking-widest font-sans">TOP 3 KEYWORDS</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full">
               {/* 1위 */}
               {top3[0] && (
                <div 
                  onClick={() => goInsight(top3[0].keyword)}
                  className="cursor-pointer relative md:col-span-1 bg-black text-white p-6 flex flex-col justify-between min-h-[340px] border border-black hover:opacity-90 transition-opacity shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider font-sans">Rank 01</span>
                    <TrendingUp className="text-white w-5 h-5" />
                  </div>
                  <div className="mt-8 mb-8">
                    <p className="text-gray-400 text-[10px] font-bold mb-3 uppercase tracking-widest font-sans">{top3[0].category}</p>
                    <h3 className="text-2xl lg:text-3xl font-bold leading-tight break-keep font-sans">{top3[0].keyword}</h3>
                  </div>
                  <div className="flex items-end justify-between border-t border-gray-800 pt-4">
                    <div>
                        <span className="text-[10px] text-gray-500 block font-bold tracking-wider font-sans">TREND SCORE</span>
                        <span className="text-3xl font-sans font-bold tracking-tighter">{top3[0].trendScore?.toLocaleString()}</span>
                    </div>
                    <div className={cn("text-white text-xs font-bold px-2 py-1 font-sans", getGrowthDisplay(top3[0].growthRate).bg)}>
                      {getGrowthDisplay(top3[0].growthRate).text}
                    </div>
                  </div>
                </div>
              )}

              {/* 2위 & 3위 */}
              {top3.slice(1, 3).map((item, idx) => (
                <div 
                  key={item.seqKeyword}
                  onClick={() => goInsight(item.keyword)}
                  className="cursor-pointer relative bg-white text-black p-6 flex flex-col justify-between border border-gray-200 hover:border-black transition-all min-h-[260px]"
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 uppercase tracking-wider group-hover:bg-black group-hover:text-white font-sans">
                        Rank 0{idx + 2}
                    </span>
                  </div>
                  <div className="mt-6 mb-6">
                    <p className="text-gray-400 text-[10px] font-bold mb-3 uppercase tracking-widest font-sans">{item.category}</p>
                    <h3 className="text-xl font-bold leading-tight break-keep line-clamp-3 font-sans">{item.keyword}</h3>
                  </div>
                  <div className="flex items-end justify-between border-t border-gray-100 pt-4">
                    <div>
                        <span className="text-[10px] text-gray-400 block font-bold tracking-wider font-sans">SCORE</span>
                        <span className="text-2xl font-sans font-bold tracking-tighter">{item.trendScore?.toLocaleString()}</span>
                    </div>
                    <div className={cn("text-xs font-bold font-sans", getGrowthDisplay(item.growthRate).color)}>
                      {getGrowthDisplay(item.growthRate).text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* [우측] Insight Brief */}
          <div className="lg:col-span-4 flex flex-col h-full">
             <div className="flex items-center justify-between mb-5 border-b border-black pb-3">
              <h2 className="text-sm font-bold tracking-widest font-sans">INSIGHT BRIEF</h2>
            </div>
            
            <div className="flex-1 bg-gray-50 border border-gray-200 p-7 flex flex-col justify-between min-h-[340px]">
              <div>
                <h3 className="text-[10px] font-bold mb-8 text-gray-400 uppercase tracking-[0.2em] font-sans">
                  Weekly Summary
                </h3>
                <ul className="space-y-8">
                  <li className="flex items-start gap-4 group">
                    <span className="text-lg font-serif text-gray-300 group-hover:text-black transition-colors mt-0.5 leading-none">01</span>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed font-sans">
                      <span className="bg-yellow-100 px-1 font-bold">
                        {top3[0]?.keyword || '1위 키워드'}
                      </span>
                      의 검색량이 전주 대비 급증했습니다.
                    </p>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <span className="text-lg font-serif text-gray-300 group-hover:text-black transition-colors mt-0.5 leading-none">02</span>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed group-hover:text-gray-900 font-sans">
                        <span className="font-bold">{top3[1]?.category || '카테고리'}</span> 관련 아이템이 꾸준한 상승세를 보입니다.
                    </p>
                  </li>
                  <li className="flex items-start gap-4 group">
                    <span className="text-lg font-serif text-gray-300 group-hover:text-black transition-colors mt-0.5 leading-none">03</span>
                    <p className="text-sm font-medium text-gray-600 leading-relaxed group-hover:text-gray-900 font-sans">
                      {top3[2]?.keyword || '3위 키워드'}가 새롭게 순위에 진입했습니다.
                    </p>
                  </li>
                </ul>
              </div>
              
              <button className="w-full mt-10 bg-black text-white py-3.5 text-[10px] font-bold tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 uppercase font-sans">
                View Full Report <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* [하단] 랭킹 리스트 */}
        <div>
           <div className="flex items-center justify-between mb-4 border-b border-black pb-3">
              <h2 className="text-sm font-bold tracking-widest font-sans">RANKING LIST</h2>
              <span className="text-[10px] font-bold bg-black text-white px-2 py-1 tracking-wider font-sans">TOTAL {ranking.length}</span>
            </div>
           
           <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse font-sans">
              <thead className="bg-white text-gray-400 font-bold border-b border-gray-200 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-4 pr-4 w-[60px] text-center">Rank</th>
                  <th className="py-4 px-4">Keyword / Category</th>
                  <th className="py-4 px-4 text-right">Score</th>
                  <th className="py-4 px-4 text-right hidden md:table-cell">Prev</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 w-[50px]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ranking.map((item, index) => (
                  <tr 
                    key={item.seqKeyword} 
                    onClick={() => goInsight(item.keyword)}
                    className="group hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="py-5 pr-4 text-center">
                      <span className={cn(
                        "text-lg font-serif italic",
                        index < 3 ? "text-black font-medium" : "text-gray-300"
                      )}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="font-bold text-black text-base group-hover:underline decoration-1 underline-offset-4">
                        {item.keyword}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wide">{item.category ?? "-"}</div>
                    </td>
                    <td className="py-5 px-4 text-right text-base font-bold tracking-tighter">
                      {item.trendScore?.toLocaleString() || 0}
                    </td>
                    <td className="py-5 px-4 text-right text-gray-400 hidden md:table-cell font-medium">
                      {item.prevScore?.toLocaleString() || 0}
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="flex justify-center items-center gap-1">
                        {item.status === "up" && (
                          <span className="text-red-600 font-bold text-xs px-2 py-1 flex items-center bg-red-50">
                            <TrendingUp className="w-3 h-3 mr-1"/> +{item.growthRate}%
                          </span>
                        )}
                        {item.status === "down" && (
                          <span className="text-blue-600 font-bold text-xs px-2 py-1 flex items-center bg-blue-50">
                            <TrendingDown className="w-3 h-3 mr-1"/> {item.growthRate}%
                          </span>
                        )}
                        {item.status === "stable" && (
                          <span className="text-gray-400 font-bold text-xs flex items-center">
                            <Minus className="w-3 h-3 mr-1"/> -
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
           </div>
        </div>

      </div>
    </div>
  );
}