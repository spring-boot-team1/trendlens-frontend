import { Routes, Route } from "react-router-dom";
import Header from "./components/inc/header";
import Example from "./pages/example";
import Index from "./pages";
import Login from "./pages/login";
import Register from "./pages/register";
import RankingPage from "./pages/RankingPage";
import InsightPage from "./pages/InsightPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      <Header />

      <Routes>
        <Route path="/example" element={<Example />} />
        <Route path="/" element={<Index />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
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
  );
}

export default App;