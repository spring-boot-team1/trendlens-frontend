import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { trendApi } from "@/lib/api";
import { Loader2, Search, ImageOff, ArrowLeft } from "lucide-react";

// 데이터 타입
interface SearchResult {
  seqKeyword: number;
  keyword: string;
  category: string;
  imgUrl?: string;
  summary?: string;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. 검색어 디코딩 처리
  const rawKeyword = searchParams.get("keyword") || "";
  const keyword = decodeURIComponent(rawKeyword);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. 검색 API 호출
  useEffect(() => {
    if (!keyword.trim()) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await trendApi.searchInsight(keyword);
        setResults(data);
      } catch (err) {
        console.error("❌ [SearchPage] 검색 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [keyword]);

  // 상세 페이지 이동
  const handleItemClick = (selectedKeyword: string) => {
    navigate(`/insight?keyword=${encodeURIComponent(selectedKeyword)}`);
  };

  // 검색바 핸들러
  const [inputVal, setInputVal] = useState(keyword);
  useEffect(() => {
      setInputVal(keyword);
  }, [keyword]);

  const handleSearch = () => {
    if(inputVal.trim()) navigate(`/search?keyword=${encodeURIComponent(inputVal)}`);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20">
      <div className="mx-auto max-w-screen-xl px-5 md:px-8">
        
        {/* 👇 [추가] 뒤로가기 버튼 영역 (Header 위에 배치) */}
        <div className="pt-8">
            <button 
                onClick={() => navigate(-1)} // 뒤로가기
                className="group flex items-center text-[10px] font-bold tracking-widest text-gray-400 hover:text-black transition-colors uppercase mb-4"
            >
                <ArrowLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>
        </div>

        {/* 상단 헤더 & 검색바 (기존 코드 유지) */}
        <div className="flex flex-col md:flex-row items-end justify-between border-b-2 border-black pb-4 mb-10 gap-6">
             <div>
                <h2 className="text-3xl font-bold font-serif italic mb-1">Search Results</h2>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                    KEYWORD: "{keyword}"
                </p>
             </div>
             <div className="relative w-full md:w-64">
                <input 
                    type="text" 
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full bg-transparent border-b border-gray-300 py-2 pr-8 pl-0 text-xs font-bold outline-none focus:border-black transition-colors"
                />
                <Search onClick={handleSearch} className="absolute right-0 top-2 h-4 w-4 cursor-pointer"/>
             </div>
        </div>

        {/* 로딩 상태 */}
        {loading && (
            <div className="flex h-60 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        )}

        {/* 결과 없음 */}
        {!loading && results.length === 0 && keyword && (
            <div className="py-20 text-center text-gray-400">
                <p className="text-sm font-bold">검색 결과가 없습니다.</p>
                <p className="text-xs mt-2">다른 키워드로 검색해보세요.</p>
            </div>
        )}

        {/* 검색 결과 리스트 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {results.map((item) => (
                <div 
                    key={item.seqKeyword} 
                    onClick={() => handleItemClick(item.keyword)}
                    className="group cursor-pointer flex flex-col"
                >
                    <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden relative border border-gray-100 flex items-center justify-center">
                        {item.imgUrl ? (
                            <img 
                                src={item.imgUrl} 
                                alt={item.keyword}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('bg-gray-200');
                                }}
                            />
                        ) : (
                             <div className="flex flex-col items-center text-gray-400">
                                <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-[10px] font-bold tracking-widest">NO IMAGE</span>
                             </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                            <span className="bg-white px-3 py-1 text-[10px] font-bold tracking-widest border border-black">VIEW</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                            {item.category}
                        </span>
                        <h3 className="text-sm font-bold leading-snug group-hover:underline underline-offset-4 decoration-1 line-clamp-2">
                            {item.keyword}
                        </h3>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}