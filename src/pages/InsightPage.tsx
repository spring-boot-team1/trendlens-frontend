{/* insight.tsx */}
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { trendApi } from "@/api/trendApi";
import { useAuthStore } from "@/store/authStore"; // ✅ Auth Store import
import { 
  Loader2, 
  ArrowLeft, 
  TrendingUp, 
  Search, 
  Sparkles, 
  Quote,
  Heart // ✅ 하트 아이콘
} from "lucide-react";

interface InsightResult {
  seqKeyword: number;
  keyword: string;
  category: string;
  imgUrl?: string | null;    
  imageUrl?: string | null;   
  summary?: string | null;
  stylingTip?: string | null;
  growthRate?: number; 
  status?: string; 
}

export default function InsightPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const navigate = useNavigate();

  const [results, setResults] = useState<InsightResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ [수정] useAuthStore 구조에 맞게 seqAccount 직접 추출
  const { accessToken, seqAccount } = useAuthStore();
  const isLoggedIn = !!accessToken; 
  
  const [isLiked, setIsLiked] = useState(false);

  // 1. 데이터 로드 및 하트 상태 확인
  useEffect(() => {
    if (!keyword) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. 인사이트 데이터 조회
        const data = await trendApi.searchInsight(keyword);
        console.log("API Data:", data); 
        setResults(data);

        // ✅ 2. 회원이고 seqAccount가 있다면: 이미 하트를 눌렀는지 확인
        if (isLoggedIn && seqAccount && data.length > 0) {
           const targetSeq = data[0].seqKeyword;
           const liked = await trendApi.checkIsLiked(seqAccount, targetSeq);
           setIsLiked(liked);
        }

      } catch (err) {
        console.error(err);
        setError("데이터 로딩 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [keyword, isLoggedIn, seqAccount]); // 의존성 배열

  // ✅ 하트 토글 핸들러
  const handleLikeToggle = async () => {
    if (!results.length || !isLoggedIn || !seqAccount) return;
    const targetSeq = results[0].seqKeyword;

    try {
      // API 호출 (seqAccount, seqKeyword 전달)
      await trendApi.toggleInterest(seqAccount, targetSeq);
      // UI 즉시 반영 (낙관적 업데이트)
      setIsLiked(!isLiked);
    } catch (e) {
      console.error("하트 토글 실패", e);
      alert("오류가 발생했습니다.");
    }
  };

  const mainInsight = results.length > 0 ? results[0] : null;
  const displayImg = mainInsight?.imgUrl || mainInsight?.imageUrl;

  // 헬퍼 함수들
  const getStatusText = (status?: string) => {
    if (status === 'up') return '상승세';
    if (status === 'down') return '하락세';
    return '유지';
  };

  const getGrowthColor = (rate?: number) => {
    if (!rate) return "text-gray-500";
    if (rate > 0) return "text-red-600";
    if (rate < 0) return "text-blue-600";
    return "text-gray-500";
  };

  const formatGrowthRate = (rate?: number) => {
    if (rate === undefined || rate === null) return "-";
    return rate > 0 ? `+${rate}%` : `${rate}%`;
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
       <Loader2 className="w-8 h-8 animate-spin text-black" />
    </div>
  );

  if (!loading && (!mainInsight || error)) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <p className="font-bold mb-4">데이터가 없습니다.</p>
      <button onClick={() => navigate(-1)} className="border-b border-black text-xs font-bold pb-1">BACK</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black pb-20 font-sans">
      <div className="mx-auto max-w-screen-xl px-5 md:px-8">
        
        {/* [Header] */}
        <div className="pt-8 pb-6 mb-12 border-b border-black flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <button 
                onClick={() => navigate(-1)}
                className="group flex items-center text-[10px] font-bold tracking-widest text-gray-400 hover:text-black mb-6 transition-colors uppercase"
            >
                <ArrowLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>
            <span className="block text-[10px] font-bold tracking-[0.2em] text-red-600 mb-3 uppercase">
                Weekly Insight
            </span>
            
            {/* ✅ 제목 영역: 로그인 시 하트 버튼 표시 */}
            <div className="flex items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight">
                    {mainInsight?.keyword}
                </h1>
                
                {isLoggedIn && (
                  <button 
                    onClick={handleLikeToggle}
                    className="group p-2 rounded-full hover:bg-red-50 transition-all active:scale-95"
                    title={isLiked ? "관심 해제" : "관심 등록"}
                  >
                    <Heart 
                      className={`w-8 h-8 transition-colors duration-300 ${
                         isLiked 
                           ? "fill-red-600 text-red-600"  // 채워진 빨간 하트
                           : "text-gray-300 group-hover:text-red-400" // 빈 하트
                      }`} 
                    />
                  </button>
                )}
            </div>

          </div>
          <div className="text-right hidden md:block pb-1">
            <span className="text-[10px] font-bold tracking-widest text-gray-400 block mb-1">CATEGORY</span>
            <span className="text-lg font-bold uppercase">{mainInsight?.category}</span>
          </div>
        </div>

        {/* [Content] */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* [Left] Image */}
          <div className="lg:col-span-5">
            <div className="sticky top-10">
              <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden border border-gray-100">
                {displayImg ? (
                  <img 
                    src={displayImg} 
                    alt={mainInsight?.keyword} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/400x533?text=NO+IMAGE'}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs tracking-widest">NO VISUAL</div>
                )}
                <div className="absolute bottom-0 left-0 bg-white/80 px-4 py-2 text-[9px] font-bold tracking-widest border-tr border-gray-100">
                  SOURCE : MUSINSA
                </div>
              </div>
            </div>
          </div>

          {/* [Right] Data */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* 1. Metrics */}
            <div>
              <h2 className="text-xs font-bold tracking-widest border-b border-black pb-3 mb-6">KEY METRICS</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Trend</span>
                    </div>
                    <p className="text-base font-bold">
                      {getStatusText(mainInsight?.status)}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <Search className="w-3 h-3" />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Growth</span>
                    </div>
                    <p className={`text-base font-bold ${getGrowthColor(mainInsight?.growthRate)}`}>
                      {formatGrowthRate(mainInsight?.growthRate)}
                    </p>
                </div>
              </div>
            </div>

            {/* 2. AI Insight */}
            <div className="relative pl-6 border-l-2 border-blue-600 py-2">
                <h2 className="text-xs font-bold tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> AI ANALYST SAYS
                </h2>
                <p className="text-lg leading-relaxed font-medium text-gray-900 break-keep">
                  "{mainInsight?.summary || '데이터 분석 대기 중입니다.'}"
                </p>
            </div>

            {/* 3. Styling Tip */}
            {mainInsight?.stylingTip && (
              <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
                 <div className="flex items-center gap-2 mb-3 text-gray-400">
                    <Quote className="w-4 h-4" />
                    <span className="text-[10px] font-bold tracking-widest">STYLING TIP</span>
                 </div>
                 <p className="text-sm leading-7 font-medium text-gray-100">
                    {mainInsight.stylingTip}
                 </p>
              </div>
            )}
            
            {/* 4. Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                {['Trend', 'Daily', 'OOTD', 'Style'].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500">#{tag}</span>
                ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}