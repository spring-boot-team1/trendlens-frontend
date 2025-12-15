import { Routes, Route } from "react-router-dom";
import Header from "./components/inc/header";
import Example from "./pages/example";
import Index from "./pages";
import BodyAnalyze from "./pages/bodyanalyze";
import Login from "./pages/login";
import Register from "./pages/register";
import Mypage from "./pages/mypage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/example" element={<Example />} />
        <Route path="/" element={<Index />} />
        <Route path="/bodyanalyze" element={<BodyAnalyze />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </>
  );
}

export default App;
