import { Routes, Route } from "react-router-dom";
import Header from "@/components/inc/header"; 
import RankingPage from "./pages/RankingPage";
import InsightPage from "./pages/InsightPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      <Header />

      <main className="pt-20"> 
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<RankingPage />} />
          
          {/* 상세 페이지 */}
          <Route path="/insight" element={<InsightPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;