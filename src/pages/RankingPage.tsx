{/* 랭킹페이지 */}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trendApi } from "@/api/trendApi";
import { useAuthStore } from "@/store/authStore"; // ✅ Auth Store import
import { Search, ArrowRight, Sparkles, MoveRight, ImageOff, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ 백엔드 데이터 타입 정의
interface TrendData {
  seqKeyword: number;
  keyword: string;
  category: string;
  trendScore: number;
  prevScore?: number;
  growthRate?: number;
  status?: "up" | "down" | "stable";
  aiSummary?: string;
  imgUrl?: string;
  imageUrl?: string;
  IMGURL?: string;
  img_url?: string;
}

const WINTER_HERO_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop";

export default function RankingPage() {
  const [ranking, setRanking] = useState<(TrendData & { displayImg: string | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ✅ [수정] useAuthStore 구조에 맞게 seqAccount 직접 추출
  const { accessToken, seqAccount } = useAuthStore();
  const isLoggedIn = !!accessToken; // 토큰이 있으면 로그인 상태로 간주

  useEffect(() => {
    const loadRanking = async () => {
      try {
        setLoading(true);
        let data;

        // ✅ 로그인 상태이고 seqAccount가 존재하면 '내 관심 랭킹' 호출
        if (isLoggedIn && seqAccount) {
            console.log(`>>> [Ranking] 회원 모드 (Account: ${seqAccount}): 내 관심 랭킹 조회`);
            data = await trendApi.getMyRanking(seqAccount);

            console.log(">>> [로그인 데이터 원본 확인]", data);
            
        } else {
            console.log(">>> [Ranking] 게스트 모드: 전체 랭킹 조회");
            data = await trendApi.getGuestRanking();
        }

        console.log(">>> [Ranking] API Data:", data);

        if (!data || !Array.isArray(data)) {
          setRanking([]);
          return;
        }

        // 1. 점수순 정렬
        const sorted = [...data].sort((a: any, b: any) => (b.trendScore ?? 0) - (a.trendScore ?? 0));

        // 2. 데이터 가공 (이미지 URL, 성장률 계산 등)
        const processed = sorted.map((item: any) => {
          let prevScore = item.prevScore;
          let growthRate = item.growthRate;

          // 데이터가 부족할 경우 임시 계산 로직 (백엔드 데이터가 완벽하면 제거 가능)
          if (prevScore === undefined || growthRate === undefined) {
            const fluctuation = Math.random() * 0.4 + 0.8;
            prevScore = Math.floor((item.trendScore ?? 0) * fluctuation);
            growthRate =
              prevScore === 0
                ? 100
                : Math.round((((item.trendScore ?? 0) - prevScore) / prevScore) * 100);
          }

          let status: "up" | "down" | "stable" = "stable";
          if (growthRate > 0) status = "up";
          else if (growthRate < 0) status = "down";

          // 이미지 필드명 통일 처리
          const rawImg = item.imgUrl || item.imageUrl || item.IMGURL || item.img_url;
          let finalImg = rawImg;
          
          if (typeof finalImg === 'string' && finalImg.startsWith("//")) {
             finalImg = "https:" + finalImg;
          }

          if (!finalImg || finalImg.trim() === "") {
             finalImg = null;
          }

          return {
            ...item,
            prevScore,
            growthRate,
            status,
            displayImg: finalImg,
          };
        });

        setRanking(processed);
      } catch (e) {
        console.error("랭킹 불러오기 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, [isLoggedIn, seqAccount]); // 의존성 배열: 로그인 상태나 계정 번호가 바뀌면 재실행

  const goInsight = (keyword: string) => {
    navigate(`/insight?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const top5 = ranking.slice(0, 5);
  const restRanking = ranking.slice(5);

  const getGrowthDisplay = (rate?: number) => {
    if (!rate || rate === 0) return { text: "0%", color: "text-gray-400" };
    if (rate > 0) return { text: `+${rate}%`, color: "text-red-600" };
    return { text: `${rate}%`, color: "text-blue-600" };
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-2xl font-serif italic text-black animate-pulse tracking-widest">
          Loading TrendLens...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      
      {/* 1. 배너 */}
      <div className="relative w-full h-[500px] bg-gray-900 overflow-hidden mb-12">
        <img src={WINTER_HERO_IMAGE} alt="Winter Mood" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
          <span className="text-xs font-bold tracking-[0.4em] uppercase mb-4 border border-white px-4 py-1">
            2025 Winter Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-serif italic font-medium mb-6">
            New Season,<br />
            New Mood.
          </h1>
          <p className="text-sm font-light tracking-wide opacity-90 max-w-md leading-relaxed">
            차가운 공기 속에 스며드는 따뜻한 감성.<br />
            이번 시즌 가장 사랑받는 트렌드 키워드를 만나보세요.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-5 md:px-8">
        
        {/* 2. 헤더 & 검색바 */}
        <div className="flex flex-col md:flex-row items-end justify-between border-b-2 border-black pb-4 mb-10 gap-6">
          <div>
            {/* ✅ 로그인 여부에 따른 제목 변경 */}
            <h2 className="text-4xl font-serif font-bold text-black mb-1 flex items-center gap-3">
               {isLoggedIn ? (
                 <>
                   <Heart className="w-8 h-8 text-red-600 fill-red-600" />
                   My Interest Ranking
                 </>
               ) : (
                 "Weekly Ranking"
               )}
            </h2>
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              {isLoggedIn 
                ? "내가 관심 등록한 키워드의 실시간 트렌드 순위" 
                : `${new Date().toLocaleDateString()} Updated`
              }
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="KEYWORD SEARCH"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-b border-gray-300 py-2 pr-8 pl-0 text-xs font-bold outline-none focus:border-black transition-colors rounded-none placeholder:text-gray-300 tracking-wider"
            />
            <Search onClick={handleSearch} className="absolute right-0 top-2 h-4 w-4 text-gray-400 cursor-pointer hover:text-black" />
          </div>
        </div>

        {/* 3. 메인 그리드 */}
        {ranking.length === 0 ? (
           <div className="py-20 text-center text-gray-400 border-t border-gray-100">
             <p className="mb-4 text-lg">데이터가 없습니다.</p>
             {isLoggedIn && <p className="text-sm">인사이트 페이지에서 하트를 눌러 관심 키워드를 등록해보세요!</p>}
           </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* 좌측 TOP5 */}
          <div className="lg:col-span-8">
            {/* 1위 강조 */}
            {top5[0] && (
              <div onClick={() => goInsight(top5[0].keyword)} className="group cursor-pointer mb-8 relative">
                <div className="aspect-[16/9] overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
                  {top5[0].displayImg ? (
                    <img
                      src={top5[0].displayImg}
                      alt={top5[0].keyword}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement?.classList.add("bg-gray-200");
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                        <ImageOff className="w-8 h-8 mb-2 opacity-50"/>
                        <span className="text-xs tracking-widest">NO IMAGE</span>
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-red-600 font-bold text-xs tracking-widest mb-1 block">
                        {isLoggedIn ? "MY BEST PICK" : "NO.1 TREND"}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold font-serif italic mb-2 group-hover:underline underline-offset-4 decoration-1">
                      {top5[0].keyword}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{top5[0].category}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-3xl font-bold tracking-tighter">{top5[0].trendScore?.toLocaleString()}</span>
                    <span className={cn("text-xs font-bold", getGrowthDisplay(top5[0].growthRate).color)}>
                      {getGrowthDisplay(top5[0].growthRate).text} Growth
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2~5위 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
              {top5.slice(1).map((item, idx) => (
                <div key={item.seqKeyword} onClick={() => goInsight(item.keyword)} className="group cursor-pointer">
                  <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-3 relative flex items-center justify-center">
                    <span className="absolute top-0 left-0 bg-black text-white text-lg font-serif italic px-3 py-1 z-10">
                      0{idx + 2}
                    </span>
                    {item.displayImg ? (
                        <img
                          src={item.displayImg}
                          alt={item.keyword}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement?.classList.add("bg-gray-200");
                          }}
                        />
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <ImageOff className="w-6 h-6 mb-1 opacity-50"/>
                            <span className="text-[10px] tracking-widest">NO IMAGE</span>
                        </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{item.category}</p>
                    <h4 className="text-lg font-bold leading-tight line-clamp-2 mb-2 group-hover:underline underline-offset-2">
                      {item.keyword}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span>Score {item.trendScore}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className={cn(getGrowthDisplay(item.growthRate).color)}>{getGrowthDisplay(item.growthRate).text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우측 인사이트 브리프 (사이드바) */}
          <div className="lg:col-span-4 sticky top-10 border-l border-gray-100 pl-0 lg:pl-10">
            <div className="mb-8 pb-4 border-b border-black">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-black" />
                <span className="text-sm font-bold tracking-[0.2em] uppercase">Insight Brief</span>
              </div>
              <p className="text-xs text-gray-500">Gemini AI가 분석한 금주 트렌드 요약</p>
            </div>

            <div className="space-y-8">
              {top5[0] && (
                <div className="group cursor-pointer" onClick={() => goInsight(top5[0].keyword)}>
                  <span className="text-[10px] font-bold text-red-600 border border-red-600 px-2 py-0.5 rounded-full mb-2 inline-block">
                    HOT ISSUE
                  </span>
                  <p className="text-base font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
                    이번 주 가장 뜨거운 키워드, <br />
                    <span className="underline decoration-1 underline-offset-2">"{top5[0].keyword}"</span>의 급상승 이유
                  </p>
                </div>
              )}

              {top5[1] && (
                <div className="group cursor-pointer" onClick={() => goInsight(top5[1].keyword)}>
                  <span className="text-[10px] font-bold text-gray-400 border border-gray-300 px-2 py-0.5 rounded-full mb-2 inline-block">
                    RISING
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-gray-700 group-hover:text-black">
                    <span className="font-bold text-black">{top5[1].category}</span> 카테고리에서 <br />
                    새롭게 주목받는 {top5[1].keyword} 스타일링 팁
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-6 border border-gray-100">
                <p className="text-xs leading-relaxed font-serif italic text-gray-600">
                  "전반적으로 기온 하락에 따른 보온성 아이템의 검색량이 증가하고 있습니다. 특히 무채색 계열의 미니멀한 아우터가 강세입니다."
                </p>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <div className="w-6 h-0.5 bg-gray-300"></div>
                  <span className="text-[9px] font-bold tracking-widest text-gray-400">AI ANALYST</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-10 py-3 bg-black text-white text-xs font-bold tracking-[0.2em] hover:opacity-80 transition-opacity uppercase flex items-center justify-center gap-2">
              Read Full Report <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
        )}
        
        {/* 4. More Trends (나머지 리스트) - 데이터가 있을 때만 표시 */}
        {restRanking.length > 0 && (
            <div className="mt-20 border-t border-black pt-10">
              <h3 className="text-xl font-serif font-bold italic mb-6">More Trends</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-gray-100">
                    {restRanking.map((item, index) => (
                      <tr
                        key={item.seqKeyword}
                        onClick={() => goInsight(item.keyword)}
                        className="group hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                         <td className="py-4 text-center w-[60px]">
                            <span className="text-lg font-serif italic text-gray-300 group-hover:text-black">{index + 6}</span>
                         </td>
                         <td className="py-3 px-4 w-[60px]">
                            <div className="w-10 h-10 bg-gray-100 overflow-hidden rounded-full border border-gray-100 flex items-center justify-center">
                              {item.displayImg ? (
                                  <img
                                    src={item.displayImg}
                                    alt={item.keyword}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      e.currentTarget.parentElement?.classList.add("bg-gray-200");
                                    }}
                                  />
                              ) : (
                                   <ImageOff className="w-4 h-4 text-gray-300"/>
                              )}
                            </div>
                         </td>
                         <td className="py-3 px-4">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{item.category}</div>
                            <div className="text-sm font-bold text-black group-hover:underline underline-offset-4 decoration-1 line-clamp-1">
                              {item.keyword}
                            </div>
                         </td>
                         <td className="py-3 px-4 text-right font-bold tracking-tighter text-sm">{item.trendScore?.toLocaleString()}</td>
                         <td className="py-3 px-4 text-right">
                           <div className="flex items-center justify-end gap-1">
                             <span className={cn("text-[10px] font-bold", getGrowthDisplay(item.growthRate).color)}>
                               {getGrowthDisplay(item.growthRate).text}
                             </span>
                             <MoveRight className="w-3 h-3 text-gray-300 group-hover:text-black transition-colors" />
                           </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}

      </div>
    </div>
  );
}