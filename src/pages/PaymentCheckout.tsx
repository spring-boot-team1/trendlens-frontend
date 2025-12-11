// src/pages/PaymentCheckout.tsx
import { useEffect, useRef, useState } from "react";
// import axios from "axios";
import {
  loadPaymentWidget,
  ANONYMOUS,
} from "@tosspayments/payment-widget-sdk";

// 타입 전용 import (TS 오류 해결)
import type { PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

// 1) 환경변수에서 Toss clientKey 읽기 (Vite 규칙상 VITE_로 시작)
const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

// 2) 실제 서비스에서는 로그인 사용자 고유값을 쓰는 게 안전하지만,
// 지금은 테스트용으로 Toss에서 제공하는 비회원 상수 사용
const customerKey = ANONYMOUS;

function PaymentCheckout() {
    // Toss 결제위젯 인스턴스를 저장해 두기 위한 ref
    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);

    //테스트용 금액 (단위: 원)
    const [amount] = useState<number>(100);

    // 화면이 한 번 렌더링된 후 Toss 위젯 초기화
    useEffect(() => {
        if (!clientKey) {
            console.error("VITE_TOSS_CLIENT_KEY 환경변수가 설정되지 않았습니다.");
            return;
        }

        (async () => {
            try {
                // 1) 위젯 로딩 (클라이언트 키, 고객 키) :contentReference[oaicite:4]{index=4}
                const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

                // ✨ Toss SDK는 string selector만 받음
                await paymentWidget.renderPaymentMethods(
                    "#payment-methods",
                    { value: amount },
                    { variantKey: "DEFAULT" }
                );

                await paymentWidget.renderAgreement("#agreement");

                paymentWidgetRef.current = paymentWidget;
      } catch (err) {
        console.error("결제 위젯 로딩 오류:", err);
      }
    })();
  }, [amount]);

  const handlePayment = async () => {
    if (!paymentWidgetRef.current) {
      alert("결제위젯이 준비되지 않았습니다.");
      return;
    }

    const orderId = `TREND-${Date.now()}`;
    const orderName = "TrendLens 구독 1개월";

    try {
      await paymentWidgetRef.current.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error("결제 요청 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">

        <h1 className="text-2xl font-semibold text-slate-900 mb-6">
          TrendLens 구독 결제
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            구독 상품 정보
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            TrendLens 인사이트 구독 1개월권입니다.
          </p>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-medium text-slate-800">
                TrendLens 구독 1개월
              </div>
              <div className="text-xs text-slate-500 mt-1">
                테스트 금액: {amount.toLocaleString()}원
              </div>
            </div>
            <div className="text-xl font-bold text-sky-600">
              {amount.toLocaleString()}원
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 p-6 space-y-4">

          <h2 className="text-lg font-semibold text-slate-900">결제 수단 선택</h2>
          <p className="text-sm text-slate-500">
            토스페이먼츠 결제위젯에서 제공하는 결제 방식을 선택할 수 있습니다.
          </p>

          {/* ✨ Toss가 렌더링할 영역 — id 필수 */}
          <div
            id="payment-methods"
            className="border border-slate-200 rounded-xl p-4"
          />

          <h2 className="text-lg font-semibold text-slate-900 pt-2">이용 약관</h2>

          <div
            id="agreement"
            className="border border-slate-200 rounded-xl p-4 bg-slate-50"
          />
        </div>

        <button
          onClick={handlePayment}
          className="w-full h-12 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors"
        >
          {amount.toLocaleString()}원 결제하기
        </button>
      </div>
    </div>
  );
}

export default PaymentCheckout;