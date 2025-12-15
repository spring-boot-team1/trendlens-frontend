import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { trendApi } from "@/api/trendApi";
import { 
  Loader2, 
  ArrowLeft, 
  TrendingUp, 
  Search, 
  Sparkles, 
  Quote
} from "lucide-react";

interface InsightResult {
  seqKeyword: number;
  keyword: string;
  category: string;
  imgUrl?: string | null;    
  imageUrl?: string | null;   
  summary?: string | null;
  stylingTip?: string | null;
  
  // ✅ [추가] 백엔드 데이터와 연결할 필드
  growthRate?: number; 
  status?: string; // "up", "down", "stable"
}

export default function InsightPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const navigate = useNavigate();

  const [results, setResults] = useState<InsightResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!keyword) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await trendApi.searchInsight(keyword);
        console.log("API Data:", data); 
        setResults(data);
      } catch (err) {
        console.error(err);
        setError("데이터 로딩 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [keyword]);

  const mainInsight = results.length > 0 ? results[0] : null;
  const displayImg = mainInsight?.imgUrl || mainInsight?.imageUrl;

  // ✅ 데이터 표시 헬퍼 로직
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
    // 양수면 앞에 + 붙이기
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
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black leading-tight">
                {mainInsight?.keyword}
            </h1>
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
            
            {/* 1. Metrics (실제 데이터 연동됨) */}
            <div>
              <h2 className="text-xs font-bold tracking-widest border-b border-black pb-3 mb-6">KEY METRICS</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Trend</span>
                    </div>
                    {/* ✅ 상태값 연동 (상승세/하락세/유지) */}
                    <p className="text-base font-bold">
                      {getStatusText(mainInsight?.status)}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                        <Search className="w-3 h-3" />
                        <span className="text-[9px] font-bold tracking-widest uppercase">Growth</span>
                    </div>
                    {/* ✅ 수치 및 색상 연동 (양수면 빨강, 음수면 파랑) */}
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