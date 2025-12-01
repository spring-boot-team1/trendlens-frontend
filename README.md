# 프로젝트 개발 환경 초기 설정 (Frontend - Vite + Tailwind + ShadCN)

## 1. 루트 폴더에서 터미널 연다
```
cd your-project-root
```

## 2. Vite 프로젝트 생성
```
npm create vite@latest
```

## 3. TailwindCSS 설치
```
npm install tailwindcss @tailwindcss/vite
```

## 4. Node 타입 설치
```
npm install -D @types/node
```

## 5. ShadCN UI 초기화
```
npx shadcn@latest init

## 5-2. react-router-dom 설치
```
npm install react-router-dom
```

## 6. .env 파일 추가
디스코드에서 공유받은 .env 파일을 루트 폴더에 추가하세요.

## 7. API 호출 방법(/예시)
```tsx
const trend = import.meta.env.API_CONTEXT_ROOT;

const response = await fetch(`${trend}/api/v1/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});
```

---

# 📖 React Router 및 페이지 관리 가이드 (초보 팀원 필독!)

안녕하세요! Trendlens 프로젝트에 오신 것을 환영합니다. 이 가이드는 새 페이지를 만들고 메뉴에 연결하는 방법을 단계별로 안내합니다.

## 1. 페이지 컴포넌트 파일 이름 규칙

새로운 페이지를 만들 때 가장 중요한 규칙입니다. 리액트 컴포넌트, 특히 **export 해서 다른 파일에서 사용될 페이지 컴포넌트의 파일 이름은 반드시 첫 글자를 대문자**로 시작해야 합니다.

- **좋은 예:** `src/pages/MarketAnalysis.tsx`
- **나쁜 예:** `src/pages/market-analysis.tsx`

현재 우리 프로젝트는 `src/pages` 폴더 안에 페이지 컴포넌트들을 모아두고 있습니다.

## 2. 새 페이지 만들기 (예: '시장 분석' 페이지)

`src/pages` 폴더 안에 `MarketAnalysis.tsx` 라는 이름으로 새 파일을 만들어 봅시다. 아래는 페이지 컴포넌트의 기본 코드입니다.

```tsx
// src/pages/MarketAnalysis.tsx

// 'rafce' 단축키를 사용하면 기본 구조를 쉽게 만들 수 있습니다. (ES7+ React/Redux/React-Native snippets 확장 프로그램 필요)
const MarketAnalysis = () => {
  return (
    <div>
      <h1>시장 분석 페이지</h1>
      {/* 여기에 페이지 내용을 채워나가세요! */}
    </div>
  );
};

export default MarketAnalysis;
```

## 3. 라우터에 새 페이지 연결하기

페이지를 만들었다면 이제 사용자가 접속할 수 있는 URL 경로를 지정해주어야 합니다. 이 작업은 `src/App.tsx` 파일에서 이루어집니다.

1.  `src/App.tsx` 파일을 엽니다.
2.  방금 만든 `MarketAnalysis` 컴포넌트를 `import` 합니다.
3.  `<Routes>` 컴포넌트 안에 새로운 `<Route>`를 추가합니다.

```tsx
// src/App.tsx

import { Routes, Route } from "react-router-dom";
import Header from "./components/inc/header";
import Example from "./pages/example";
import Index from "./pages";
import MarketAnalysis from "./pages/MarketAnalysis"; // 1. 새 페이지 import

function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* 기존 페이지들 */}
        <Route path="/example" element={<Example />} />
        <Route path="/" element={<Index />} />

        {/* 2. 새 페이지를 위한 Route 추가 */}
        {/* 사용자가 '/insight/market' 경로로 접속하면 MarketAnalysis 컴포넌트를 보여줍니다. */}
        <Route path="/insight/market" element={<MarketAnalysis />} />
      </Routes>
    </>
  );
}

export default App;
```

## 4. 헤더 메뉴에 새 페이지 링크 추가하기

이제 마지막 단계입니다. 사용자가 헤더 메뉴를 클릭해서 새 페이지로 이동할 수 있도록 링크를 추가해야 합니다. 메뉴는 `src/components/inc/header.tsx` 파일에서 관리합니다.

1.  `src/components/inc/header.tsx` 파일을 엽니다.
2.  `react-router-dom`의 `<Link>` 컴포넌트를 사용해서 메뉴 항목을 만듭니다. `to` 속성에는 `App.tsx`에서 설정한 `path`를 정확하게 입력합니다.

```tsx
// src/components/inc/header.tsx

import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom"; // Link 컴포넌트를 사용합니다.
import Logo from "@/assets/logo.png"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* ... (로고 및 다른 메뉴들) ... */}

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>

            {/* Insight */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-lg hover:text-gray-600">
                Insight
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid grid-cols-1 gap-2 p-4 w-40">
                  {/* 아래와 같이 Link 컴포넌트로 새 페이지를 연결합니다. */}
                  <Link to="/insight/market" className="hover:text-gray-600">시장 분석</Link>
                  <Link to="/insight/brand" className="hover:text-gray-600">브랜드 분석</Link>
                  <Link to="/insight/visual" className="hover:text-gray-600">비주얼 리포트</Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* ... (다른 메뉴들) ... */}

          </NavigationMenuList>
        </NavigationMenu>

        {/* ... (로그인 영역) ... */}
      </div>
    </header>
  );
}
```

이제 `npm run dev`로 개발 서버를 실행하고 'Insight' 메뉴에 마우스를 올리면 '시장 분석' 링크가 보일 것이며, 클릭하면 우리가 만든 페이지로 잘 이동하는 것을 확인할 수 있습니다.

궁금한 점이 있다면 언제든지 편하게 질문해주세요!