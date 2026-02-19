import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/testHome";
import LawGPT from "./pages/LawGPT";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LawGPT" element={<LawGPT />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
