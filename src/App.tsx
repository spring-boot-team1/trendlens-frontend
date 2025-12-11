import { Routes, Route } from "react-router-dom";
import Header from "./components/inc/header";
import Index from "./pages";
import PaymentCheckout from "./pages/PaymentCheckout";
import PaymentSuccess  from "./pages/PaymentSuccess";
import PaymentFail  from "./pages/PaymentFail";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />

        {/* ✅ 결제 페이지 라우트 추가 */}
        <Route path="/payment/checkout" element={<PaymentCheckout />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFail />} />
      </Routes>
    </>
  );
}

export default App;
