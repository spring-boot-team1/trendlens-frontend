import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/assets/logo.png";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/api/auth";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { accessToken } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" onClick={closeMobileMenu}>
          <img src={Logo} className="w-30 h-auto" />
        </Link>

        {/* 데스크톱 네비게이션 (md 이상) */}
        <NavigationMenu className="hidden md:flex" viewport={false}>
          <NavigationMenuList>
            {/* Insight */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xl hover:text-gray-600 font-bold">
                Insight
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-1 gap-2 p-4 w-40">
                  <Link to="/example" className="hover:text-gray-600">
                    예시
                  </Link>
                  <Link to="/insight/brand" className="hover:text-gray-600">
                    브랜드 분석
                  </Link>
                  <Link to="/insight/visual" className="hover:text-gray-600">
                    비주얼 리포트
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Trend */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xl hover:text-gray-600 font-bold">
                Trend
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-1 gap-2 p-4 w-40">
                  <Link to="/trend/keyword" className="hover:text-gray-600">
                    트렌드 키워드
                  </Link>
                  <Link to="/trend/color" className="hover:text-gray-600">
                    컬러 트렌드
                  </Link>
                  <Link to="/trend/textile" className="hover:text-gray-600">
                    텍스타일
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Statistics */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xl hover:text-gray-600 font-bold">
                Statistics
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-1 gap-2 p-4 w-40">
                  <Link to="/stat/sales" className="hover:text-gray-600">
                    매출 통계
                  </Link>
                  <Link to="/stat/season" className="hover:text-gray-600">
                    시즌별 통계
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* 콘텐츠 */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-xl hover:text-gray-600 font-bold">
                Content
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-1 gap-2 p-4 w-40">
                  <Link to="/payments/checkout" className="hover:text-gray-600">
                    구독 결제
                  </Link>
                  <Link to="/bodyanalyze" className="hover:text-gray-600">
                    AI체형분석
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* 데스크톱 로그인 영역 */}
        <div className="hidden md:flex items-center gap-4">
          {accessToken ? (
            <>
              <button
                className="text-sm hover:text-gray-600"
                onClick={() => navigate("/mypage")}
              >
                마이페이지
              </button>
              <button
                className="text-sm hover:text-gray-600"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                className="text-sm hover:text-gray-600"
                onClick={() => navigate("/login")}
              >
                로그인
              </button>
              <button
                className="text-sm hover:text-gray-600"
                onClick={() => navigate("/register")}
              >
                회원가입
              </button>
            </>
          )}
        </div>

        {/* 모바일 햄버거 버튼 (md 미만) */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ✅ 모바일 메뉴 + 애니메이션 */}
      <div
        className={`
          md:hidden fixed inset-0 z-40
          transition-opacity duration-300
          ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* 반투명 배경 */}
        <div
          className={`
            absolute inset-0 bg-black/40
            transition-opacity duration-300
            ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={closeMobileMenu}
        />

        {/* 오른쪽 슬라이드 메뉴 */}
        <div
          className={`
            absolute right-0 top-0 h-full w-64 bg-white shadow-lg
            pt-16 pb-6 px-6 flex flex-col gap-6
            transform transition-transform duration-300 ease-out
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {/* 카테고리 */}
          <nav className="flex-1 flex flex-col gap-4 text-base">
            {/* Insight */}
            <div>
              <div className="font-bold mb-2">Insight</div>
              <div className="flex flex-col gap-1">
                <Link
                  to="/insight/market"
                  onClick={closeMobileMenu}
                  className="hover:text-gray-600"
                >
                  예시
                </Link>
                <Link
                  to="/insight/brand"
                  onClick={closeMobileMenu}
                  className="hover:text-gray-600"
                >
                  브랜드 분석
                </Link>
                <Link
                  to="/insight/visual"
                  onClick={closeMobileMenu}
                  className="hover:text-gray-600"
                >
                  비주얼 리포트
                </Link>
              </div>
            </div>

            {/* Trend */}
            <div>
              <div className="font-bold mb-2">Trend</div>
              <div className="flex flex-col gap-1">
                <Link
                  to="/trend/keyword"
                  onClick={closeMobileMenu}
                  className="hover:text-gray-600"
                >
                  트렌드 키워드
                </Link>
                <Link
                  to="/trend/color"
                  onClick={closeMobileMenu}
                  className="hover:text-gray-600"
                >
                  컬러 트렌드
                </Link>
                <Link
                  to="/trend/textile"
                  onClick={closeMobileMenu}
                  className="hover:text-gray-600"
                >
                  텍스타일
                </Link>
              </div>
            </div>

            {/* Statistics */}
            <div>
              <div className="font-bold mb-2">Statistics</div>
              <div className="flex flex-col gap-1">
                <Link
                  to="/stat/sales"
                  onClick={closeMobileMenu}
                  className="hover:text-gray-600"
                >
                  매출 통계
                </Link>
                <Link
                  to="/stat/season"
                  onClick={closeMobileMenu}
                  className="hover:text-gray-600"
                >
                  시즌별 통계
                </Link>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="font-bold mb-2">Content</div>
              <div className="flex flex-col gap-1">
                <Link
                  to="/payments/checkout"
                  onClick={closeMobileMenu}
                  className="hover:text-gray-600"
                >
                  구독 결제
                </Link>
                <Link
                  to="/bodyanalyze"
                  onClick={closeMobileMenu}
                  className="hover:text-gray-600"
                >
                  AI체형분석
                </Link>
              </div>
            </div>
          </nav>

          {/* 모바일 로그인 영역 */}
          <div className="mt-auto flex flex-col gap-2">
            {accessToken ? (
              <>
                <button
                  className="text-sm text-left hover:text-gray-600"
                  onClick={() => {
                    navigate("/mypage");
                    closeMobileMenu();
                  }}
                >
                  마이페이지
                </button>

                <button
                  className="text-sm text-left hover:text-gray-600"
                  onClick={async () => {
                    await handleLogout();
                    closeMobileMenu();
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  className="text-sm text-left hover:text-gray-600"
                  onClick={() => {
                    navigate("/login");
                    closeMobileMenu();
                  }}
                >
                  로그인
                </button>

                <button
                  className="text-sm text-left hover:text-gray-600"
                  onClick={() => {
                    navigate("/register");
                    closeMobileMenu();
                  }}
                >
                  회원가입
                </button>
              </>
            )}
          </div>




        </div>
      </div>
    </header>
  );
}


