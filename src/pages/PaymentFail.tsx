// src/pages/PaymentFail.tsx
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentFail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-red-500 mb-4">
          결제에 실패했습니다
        </h1>

        <div className="space-y-2 text-sm text-slate-700 mb-6">
          {orderId && (
            <div className="flex justify-between">
              <span className="text-slate-500">주문번호</span>
              <span className="font-medium">{orderId}</span>
            </div>
          )}
          {code && (
            <div className="flex justify-between">
              <span className="text-slate-500">오류 코드</span>
              <span className="font-medium">{code}</span>
            </div>
          )}
          {message && (
            <p className="text-slate-700 mt-2">사유: {message}</p>
          )}
        </div>

        <button
          className="w-full h-10 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900"
          onClick={() => navigate("/payment/checkout")}
        >
          다시 결제 시도하기
        </button>
      </div>
    </div>
  );
}

export default PaymentFail;
