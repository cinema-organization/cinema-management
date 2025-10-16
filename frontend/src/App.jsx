import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; 
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx"; 

// Importation des pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";

const App = () => {
  // Fix: Cohérent avec reducer "auth"
  const user = useSelector((state) => state.auth?.user);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn || false);  // Force false si undefined

  console.log("Utilisateur connecté :", user);
  console.log("isLoggedIn :", isLoggedIn);

  return (
    <Router>
      <Routes>
        {/* Pages publiques - Fix: !isLoggedIn pour afficher, sinon /films */}
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/films" replace />}
        />
        <Route
          path="/register"
          element={
            !isLoggedIn ? <Register /> : <Navigate to="/films" replace />
          }
        />

        {/* Redirection de la racine - Fix: vers /films si logged, /login sinon */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/films" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Pages protégées (user) */}
        <Route
          path="/films"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Routes admin protégées */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              {/* Tu mettras ici <AdminDashboard /> ou d'autres sous-pages admin */}
            </AdminProtectedRoute>
          }
        />

        {/* Catch-all pour erreurs (ex: /home → /films ou /login) */}
        <Route
          path="*"
          element={
            isLoggedIn ? <Navigate to="/films" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;