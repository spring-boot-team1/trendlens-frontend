import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface MyPageResponse {
  email: string;
  username: string;
  role: string;
  profilePic: string;
  seqAccount: number;
}

const MyPage = () => {
  const [myInfo, setMyInfo] = useState<MyPageResponse | null>(null);
  const [profileUrl, setProfileUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMyPage = async () => {
      try {
        const { data } = await axiosInstance.get<MyPageResponse>(
          "/api/v1/mypage"
        );

        setMyInfo(data);

        const res = await axiosInstance.get("/api/v1/user/profile-image", {
          params: { key: data.profilePic },
        });

        setProfileUrl(res.data);
      } catch (e) {
        console.error(e);
        setError("마이페이지를 불러오지 못했습니다.");
      }
    };

    loadMyPage();
  }, []);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!myInfo) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="flex justify-center pt-40 pb-12">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileUrl} />
            <AvatarFallback>
              {myInfo.username.slice(0, 1)}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <CardTitle className="text-xl">
              {myInfo.username}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {myInfo.email}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">권한</span>
              <span>{myInfo.role}</span>
            </p>
          </div>

          <Button className="w-full">
            프로필 수정
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPage;
