import { Routes, Route } from "react-router-dom";
import Header from "./components/inc/header";
import Index from "./pages";
import BodyAnalyze from "./pages/bodyanalyze";
import Login from "./pages/login";
import Register from "./pages/register";
import Mypage from "./pages/mypage";
import RankingPage from "./pages/RankingPage";
import InsightPage from "./pages/InsightPage";
import SearchPage from "./pages/SearchPage";
import PaymentCheckout from "./pages/PaymentCheckout";
import PaymentSuccess  from "./pages/PaymentSuccess";
import PaymentFail  from "./pages/PaymentFail";
import SubscriptionStatus  from "./pages/SubscriptionStatus";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/bodyanalyze" element={<BodyAnalyze />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/mypage" element={<Mypage />} />

        {/* ✅ 결제 페이지 라우트 추가 */}
        <Route path="/payments/checkout" element={<PaymentCheckout />} />
        <Route path="/payments/success" element={<PaymentSuccess />} />
        <Route path="/payments/fail" element={<PaymentFail />} />
        <Route path="/payments/subscriptionstatus" element={<SubscriptionStatus />} />
      </Routes>
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