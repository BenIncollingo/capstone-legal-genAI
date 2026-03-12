import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/testHome";
import LawGPT from "./pages/LawGPT";
import Login from "./components/SignIn.jsx"
import Create from "./components/Create.jsx";
import HomeTwo from "./components/Home.jsx";
import { AuthProvider } from "./contexts/authContext/index.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/LawGPT" element={<LawGPT />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/home" element={<HomeTwo />} />
        </Routes>
      </BrowserRouter>
      
    </AuthProvider>
  );
}

export default App;
