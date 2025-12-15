import { Routes, Route } from "react-router-dom";
import Header from "@/components/inc/header"; 
import Example from "./pages/example";
import Index from "./pages";

import RankingPage from "./pages/RankingPage";
import InsightPage from "./pages/InsightPage";
import SearchPage from "./pages/SearchPage";
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
          <Route path="/" element={<RankingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/insight" element={<InsightPage />} />
          <Route path="/example" element={<Example />} />
          <Route path="/index" element={<Index />} />
          <Route path="/bodyanalyze" element={<BodyAnalyze />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
