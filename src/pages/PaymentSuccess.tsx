// src/pages/PaymentSuccess.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface ConfirmResponse {
  // 백엔드에서 반환해줄 구조에 맞게 나중에 수정
  orderId: string;
  amount: number;
  paymentKey: string;
  status: string;
  nextBillingDate?: string;
}

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ConfirmResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setError("결제 정보가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const BASE = import.meta.env.VITE_API_BASE_URL; // 백엔드 기본 URL

        const url = `${BASE}/trend/api/v1/payments/confirm`;
        console.log("BASE =", BASE);
        console.log("CONFIRM URL =", url);

        const response = await axios.post(url, {
          paymentKey,
          orderId,
          amount: Number(amount),
        });
        setResult(response.data);
      } catch (err: any) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "결제 승인 처리 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-slate-700">결제 승인 처리 중입니다...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md">
          <h1 className="text-xl font-semibold text-red-600 mb-3">
            결제 승인 실패
          </h1>
          <p className="text-slate-700 mb-6">{error}</p>
          <button
            className="w-full h-10 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900"
            onClick={() => navigate("/payments/checkout")}
          >
            다시 결제 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">
          결제가 완료되었습니다 🎉
        </h1>

        <div className="space-y-2 text-sm text-slate-700 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-500">주문번호</span>
            <span className="font-medium">{result.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">결제 금액</span>
            <span className="font-medium">
              {result.amount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">결제 상태</span>
            <span className="font-medium">{result.status}</span>
          </div>
          {result.nextBillingDate && (
            <div className="flex justify-between">
              <span className="text-slate-500">다음 결제 예정일</span>
              <span className="font-medium">{result.nextBillingDate}</span>
            </div>
          )}
        </div>

        <button
          className="w-full h-10 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 mb-2"
          onClick={() => navigate("/")}
        >
          메인으로 이동
        </button>
        <button
          className="w-full h-10 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
          onClick={() => navigate("/mypage/subscription")}
        >
          내 구독 정보 보기 (예정)
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
