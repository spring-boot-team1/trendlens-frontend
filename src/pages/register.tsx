import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { getPresignedUrl, uploadImageToS3 } from "@/api/s3";
import { signup } from "@/api/auth";

type ErrorState = {
  email?: string;
  password?: string;
  username?: string;
  nickname?: string;
  phonenum?: string;
  birthday?: string;
};

const Register = () => {
  const navigate = useNavigate();

  /* ===============================
     body 배경 제어
  =============================== */
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#f3f4f6"; // bg-gray-100

    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [birthday, setBirthday] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);

  const validateSignup = () => {
    const newErrors: ErrorState = {};

    if (!email) newErrors.email = "이메일은 필수입니다.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "이메일 형식이 올바르지 않습니다.";
    }

    if (!password) newErrors.password = "비밀번호는 필수입니다.";
    else if (password.length < 4) {
      newErrors.password = "비밀번호는 최소 4자 이상이어야 합니다.";
    }

    if (!username) newErrors.username = "이름은 필수입니다.";
    if (!nickname) newErrors.nickname = "닉네임은 필수입니다.";

    if (!phonenum) newErrors.phonenum = "전화번호는 필수입니다.";
    else if (!/^\d{10,11}$/.test(phonenum)) {
      newErrors.phonenum = "전화번호는 숫자만 입력해주세요.";
    }

    if (!birthday) newErrors.birthday = "생년월일은 필수입니다.";
    else if (!/^\d{8}$/.test(birthday)) {
      newErrors.birthday = "생년월일은 YYYYMMDD 형식이어야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;
    setLoading(true);

    try {
      let profileKey: string | null = null;

      if (file) {
        const { presignedURL, fileURL } = await getPresignedUrl(file);
        await uploadImageToS3(presignedURL, file);
        profileKey = fileURL;
      }

      await signup({
        email,
        password,
        username,
        nickname,
        phonenum,
        birthday,
        profilepic: profileKey,
      });

      alert("가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("가입에 실패하였습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 p-4 overflow-y-auto">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            회원가입
          </CardTitle>
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">
                이메일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                placeholder="example@naver.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">
                비밀번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1">
              <Label htmlFor="username">
                이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                placeholder="홍길동"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: undefined }));
                }}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Nickname */}
            <div className="space-y-1">
              <Label htmlFor="nickname">
                닉네임 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nickname"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setErrors((prev) => ({ ...prev, nickname: undefined }));
                }}
              />
              {errors.nickname && (
                <p className="text-sm text-red-500">{errors.nickname}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phonenum">
                전화번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phonenum"
                placeholder="01012345678"
                value={phonenum}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setPhonenum(e.target.value);
                  }
                  setErrors((prev) => ({ ...prev, phonenum: undefined }));
                }}
              />
              {errors.phonenum && (
                <p className="text-sm text-red-500">{errors.phonenum}</p>
              )}
            </div>

            {/* Birthday */}
            <div className="space-y-1">
              <Label htmlFor="birthday">
                생년월일 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birthday"
                placeholder="19991212"
                value={birthday}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setBirthday(e.target.value);
                  }
                  setErrors((prev) => ({ ...prev, birthday: undefined }));
                }}
              />
              {errors.birthday && (
                <p className="text-sm text-red-500">{errors.birthday}</p>
              )}
            </div>

            {/* Profile Image */}
            <div className="space-y-1">
              <Label htmlFor="profile-image">프로필 이미지</Label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={onFileChange}
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
};

export default Register;
