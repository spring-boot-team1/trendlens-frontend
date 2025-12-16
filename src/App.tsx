import { Routes, Route } from "react-router-dom";
import Header from "./components/inc/header";
import Index from "./pages";
import PaymentCheckout from "./pages/PaymentCheckout";
import PaymentSuccess  from "./pages/PaymentSuccess";
import PaymentFail  from "./pages/PaymentFail";
import SubscriptionStatus  from "./pages/SubscriptionStatus";
import Login from "./pages/login";
import Register from "./pages/register";
import Mypage from "./pages/mypage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />

        {/* ✅ 결제 페이지 라우트 추가 */}
        <Route path="/payments/checkout" element={<PaymentCheckout />} />
        <Route path="/payments/success" element={<PaymentSuccess />} />
        <Route path="/payments/fail" element={<PaymentFail />} />
        <Route path="/payments/subscriptionstatus" element={<SubscriptionStatus />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </>
  );
}

export default App;
