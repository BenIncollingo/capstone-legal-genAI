import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/testHome";
import LawGPT from "./pages/LawGPT";
import Login from "./components/SignIn.jsx"

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LawGPT" element={<LawGPT />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
