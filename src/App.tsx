import { Routes, Route } from "react-router-dom";
import Header from "@/components/inc/header"; 
import RankingPage from "./pages/RankingPage";
import InsightPage from "./pages/InsightPage";
import SearchPage from "./pages/SearchPage";
import Header from "./components/inc/header";
import Example from "./pages/example";
import Index from "./pages";
import BodyAnalyze from "./pages/bodyanalyze";
import Login from "./pages/login";
import Register from "./pages/register";
import Mypage from "./pages/mypage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      <Header />

      <main className="pt-15"> 
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<RankingPage />} />
          {/* 검색 페이지*/}
          <Route path="/search" element={<SearchPage />} />
          {/* 상세 페이지 */}
          <Route path="/insight" element={<InsightPage />} />
        </Routes>
      </main>
    </div>
      <Routes>
        <Route path="/example" element={<Example />} />
        <Route path="/" element={<Index />} />
        <Route path="/bodyanalyze" element={<BodyAnalyze />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </>
  );
}

export default App;