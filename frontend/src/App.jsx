import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
// Importe toutes les pages...

const App = () => {
  const { isLoggedIn} = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/films" />} />
        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/films" />} />
        <Route path="/" element={isLoggedIn ? <Navigate to="/films" /> : <Navigate to="/login" />} />
        <Route path="/films" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        {/* Autres routes user */}
        <Route path="/admin/*" element={<AdminProtectedRoute>{/* Nested admin routes */}</AdminProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;