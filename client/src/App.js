import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LawGPT from "./pages/LawGPT";
import Login from "./components/SignIn.jsx";
import Create from "./components/Create.jsx";
import DocumentsPage from "./pages/DocumentUploadPage.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import { AuthProvider } from "./contexts/authContext/index.jsx";
import { useAuth } from "./contexts/authContext/index.jsx";

function ProtectedRoute({ children }) {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LawGPT />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/create"
            element={
              <PublicRoute>
                <Create />
              </PublicRoute>
            }
          />

          <Route
            path="/reset"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/documentUpload"
            element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;