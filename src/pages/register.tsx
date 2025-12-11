import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { getPresignedUrl, uploadImageToS3 } from "@/api/s3";
import { signup } from "@/api/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [birthday, setBirthday] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSignup = async () => {
    try {
      let profileKey: string | null = null;

      if (file) {
        // 1. Presigned URL 발급
        const { presignedURL, fileURL } = await getPresignedUrl(file);

        // 2. S3 업로드
        await uploadImageToS3(presignedURL, file);

        // 3. 회원가입 DTO에 등록
        profileKey = fileURL;
      }

      // 4. 회원가입 API 호출
      const request = {
        email,
        password,
        username,
        nickname,
        phonenum,
        birthday,
        profilepic: profileKey,
      };

      await signup(request);
      alert("회원가입 완료!");
    } catch (error) {
      console.error(error);
      alert("회원가입 실패");
    }
  };

  return (
    <div className="flex justify-center mt-50">
      <div className="w-full max-w-md p-6 border rounded-lg shadow-sm space-y-5">
        <h1 className="text-2xl font-bold text-center">회원가입</h1>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            placeholder="example@naver.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">이름</Label>
          <Input
            id="username"
            placeholder="홍길동"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Nickname */}
        <div className="space-y-2">
          <Label htmlFor="nickname">닉네임</Label>
          <Input
            id="nickname"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phonenum">전화번호</Label>
          <Input
            id="phonenum"
            placeholder="01012345678"
            value={phonenum}
            onChange={(e) => setPhonenum(e.target.value)}
          />
        </div>

        {/* Birthday */}
        <div className="space-y-2">
          <Label htmlFor="birthday">생년월일</Label>
          <Input
            id="birthday"
            placeholder="19991212"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>

        {/* Profile Image */}
        <div className="space-y-2">
          <Label htmlFor="profile-image">프로필 이미지 (선택)</Label>
          <Input id="profile-image" type="file" accept="image/*" onChange={onFileChange} />
          {file && (
            <p className="text-sm text-muted-foreground">
              선택된 파일: {file.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button className="w-full" onClick={handleSignup}>
          회원가입
        </Button>
      </div>
    </div>
  );
};

export default Register;
