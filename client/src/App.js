import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/testHome";
import LawGPT from "./pages/LawGPT";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        { <Route path="/LawGPT" element={<LawGPT />} /> }
        { <Route path="/Admin" element={<Admin />} /> }
      </Routes>
    </BrowserRouter>
  );
}

export default App;