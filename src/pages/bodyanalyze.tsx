import OriginImageBox from "@/components/bodyAnalyzeInc/OriginImageBox";
import type { BodyAnalysisResponse } from "@/types/BodyAnalysisResponse";
import type { Gender } from "@/types/Gender";
import { useEffect, useState } from "react";
import MeshViewerBox from "@/components/bodyAnalyzeInc/MeshViewerBox";
import FashionRecommendBox from "@/components/bodyAnalyzeInc/FashionRecommendBox";
import axiosInstance from "@/api/axiosInstance";
import { useAuthStore } from "@/store/authStore";

export default function BodyAnalyze() {


    const [data, setData] = useState<BodyAnalysisResponse | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [gender, setGender] = useState<Gender>("U");  // ✅ 여기도 공통 타입

    const [isLoading, setIsLoading] = useState(false);

    const seqAccount = useAuthStore((s) => s.seqAccount);

    const handleFileSelect = (newFile: File) => {
        setFile(newFile);

        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(newFile);
        });
    };

    const handleAnalyze = async () => {

        if (isLoading) return;

        if (!file) {
            alert("전신 사진을 먼저 업로드해 주세요.");
            return;
        }
        if (!height || !weight) {
            alert("키와 몸무게를 입력해 주세요.");
            return;
        }
        if (!seqAccount) {
            alert("로그인 정보가 없습니다. 다시 로그인해 주세요.");
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("imageFile", file);
            formData.append("heightCm", height);
            formData.append("weightKg", weight);
            formData.append("gender", gender);
            // TODO: 로그인 정보에서 실제 seqAccount 꺼내 쓰면 됨
            formData.append("seqAccount", String(seqAccount));

            const res = await axiosInstance.post<BodyAnalysisResponse>(
                `/api/v1/analyze/body`,
                formData,

            );

            setData(res.data);
            console.log("✅ 분석 결과:", res.data);
        } catch (err) {
            console.error("❌ 분석 API 호출 실패", err);
            alert("분석 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);


    return (
        <div className="mt-30 flex items-center justify-center gap-6">
            <OriginImageBox
                onFileSelect={handleFileSelect}
                previewUrl={previewUrl}
                height={height}
                weight={weight}
                gender={gender}
                onHeightChange={setHeight}
                onWeightChange={setWeight}
                onGenderChange={setGender}
                onClickMeasure={handleAnalyze}
                isLoading={isLoading}
            />
            <FashionRecommendBox data={data} isLoading={isLoading} />
            <MeshViewerBox meshUrl={data?.meshUrl} isLoading={isLoading} />

        </div>
    );
}