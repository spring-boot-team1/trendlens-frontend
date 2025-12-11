import { Routes, Route } from "react-router-dom";
import Header from "./components/inc/header";
import Example from "./pages/example";
import Index from "./pages";
import Login from "./pages/login";
import BodyAnalyze from "./pages/bodyanalyze";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/example" element={<Example />} />
        <Route path="/" element={<Index />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/bodyanalyze" element={<BodyAnalyze />} />
      </Routes>
    </>
  );
}

export default App;
