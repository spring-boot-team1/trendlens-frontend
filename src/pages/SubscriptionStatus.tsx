import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";

interface SubscriptionStatusResponse {
  planName: string;
  status: string;
  startDate: string;
  nextBillingDate: string;
}

export default function SubscriptionStatus() {
  const [data, setData] = useState<SubscriptionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  //const [error, setError] = useState<string | null>(null);

  const seqAccount = useAuthStore((state) => state.seqAccount);

  useEffect(() => {
  if (seqAccount === null || seqAccount === undefined) {
    setLoading(false);
    return;
  }

  axiosInstance
    .get<SubscriptionStatusResponse>(
      "/api/v1/subscriptions/status",
      { params: { seqAccount } }
    )
    .then(res => {
      setData(
        res.data ?? {
          planName: "구독 상품",
          status: "ACTIVE",
          startDate: "-",
          nextBillingDate: "-"
        }
      );
    })
    .catch(() => {
      setData({
        planName: "구독 상품",
        status: "ACTIVE",
        startDate: "-",
        nextBillingDate: "-"
      });
    })
    .finally(() => setLoading(false));
}, [seqAccount]);

if (loading) return <div className="p-10">구독 상태 조회 중...</div>;
  //if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto pt-24">
      <h1 className="text-2xl font-semibold mb-6">구독 상태 확인</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-500">구독 플랜</span>
          <span className="font-medium">{data?.planName}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">상태</span>
          <span className="font-medium text-green-600">{data?.status}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">시작일</span>
          <span className="font-medium">{data?.startDate}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">다음 결제일</span>
          <span className="font-medium">{data?.nextBillingDate}</span>
        </div>
      </div>
    </div>
  );
}
