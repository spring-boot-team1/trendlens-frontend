import type React from "react";
import { FileInput as FileInputIcon } from "lucide-react";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import type { Gender } from "@/types/Gender";


type OriginImageBoxProps = {
    onFileSelect?: (file: File) => void;
    previewUrl?: string | null;

    height: string;
    weight: string;
    gender: Gender;                        // ✅ 공통 타입 사용
    onHeightChange: (value: string) => void;
    onWeightChange: (value: string) => void;
    onGenderChange: (value: Gender) => void;

    onClickMeasure?: () => void;
    isLoading: boolean; 
};


export default function OriginImageBox({
    onFileSelect,
    previewUrl,
    height,
    weight,
    gender,
    onHeightChange,
    onWeightChange,
    onGenderChange,
    onClickMeasure,
    isLoading,
}: OriginImageBoxProps) {

    const handleGenderChange = (value: string) => {
        
        if (value === "M" || value === "F" || value === "U") {
            onGenderChange(value as Gender);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드할 수 있어요.");
            e.target.value = "";
            return;
        }

        const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
        const lowerName = file.name.toLowerCase();
        const isValidExt = allowedExt.some((ext) => lowerName.endsWith(ext));

        if (!isValidExt) {
            alert("JPG, JPEG, PNG, WEBP 형식만 업로드할 수 있어요.");
            e.target.value = "";
            return;
        }

        onFileSelect?.(file);
    };

    return (
        <div className="space-y-[10px]">
            {/* 이미지 업로드 박스 */}
            <label
                htmlFor="body-photo"
                className="
          w-[400px] h-[450px] rounded-4xl border-2 border-dashed
          flex items-center justify-center
          cursor-pointer hover:border-gray-400 hover:bg-gray-50
          overflow-hidden
          transition
        "
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="원본 전신 사진 미리보기"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                        <FileInputIcon className="text-gray-400 w-[42px] h-[42px] mb-3" />
                        <p className="text-sm text-gray-500">전신 사진을 업로드하세요</p>
                        <p className="text-[11px] text-gray-400 mt-1">
                            (클릭해서 파일 선택)
                        </p>
                    </div>
                )}
            </label>

            <input
                id="body-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />

            <div className="w-[400px] h-[290px] rounded-4xl border-2 px-6 py-5 flex flex-col gap-4 justify-center items-center">
                <div className="flex gap-6">
                    <div>
                        <p className="text-sm mb-2 text-gray-600">키</p>
                        <div className="relative">
                            <Input
                                type="number"
                                min={130}
                                max={210}
                                value={height} 
                                onChange={(e) => onHeightChange(e.target.value)}
                                step={1}
                                className="w-[120px] h-10 pr-10"
                            />
                            <span
                                className="
                  pointer-events-none
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-xs text-gray-500
                "
                            >
                                cm
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm mb-2 text-gray-600">몸무게</p>
                        <div className="relative">
                            <Input
                                type="number"
                                min={30}
                                max={150}
                                value={weight}
                                onChange={(e) => onWeightChange(e.target.value)}
                                step={0.1}
                                className="w-[120px] h-10 pr-10"
                            />
                            <span
                                className="
                  pointer-events-none
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-xs text-gray-500
                "
                            >
                                kg
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-sm mb-2 text-gray-600">성별</p>
                    <RadioGroup
                        value={gender}
                        onValueChange={handleGenderChange}
                        className="flex gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="U" id="gender-u" />
                            <Label htmlFor="gender-u" className="text-xs text-gray-700">
                                선택 안 함
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="M" id="gender-m" />
                            <Label htmlFor="gender-m" className="text-xs text-gray-700">
                                남성 (M)
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="F" id="gender-f" />
                            <Label htmlFor="gender-f" className="text-xs text-gray-700">
                                여성 (F)
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex justify-center mt-10">
                    <Button disabled={isLoading} type="button" onClick={onClickMeasure} className="px-5 py-2 rounded-2xl text-sm">
                        측정하기
                    </Button>
                </div>
            </div>
        </div>
    );
}
