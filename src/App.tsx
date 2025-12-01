import { Routes, Route } from "react-router-dom";
import Header from "./components/inc/header";
import Example from "./pages/example";
import Index from "./pages";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/example" element={<Example />} />
        <Route path="/" element={<Index />} />
      </Routes>
    </>
  );
}

export default App;
