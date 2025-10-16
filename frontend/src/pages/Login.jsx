import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/userSlice";  // Utilise le thunk
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);  // Récupère loading/error/user du slice

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));  // Dispatch thunk (gère async)

    // Écoute fulfilled via useEffect ou navigate après (ici: écoute state change)
  };

  // useEffect pour nav après succès (ou écoute dans slice)
  React.useEffect(() => {
    if (!loading && !error && user) {  // Succès implicite
      const { role } = user;
      if (role === "admin") navigate("/admin/dashboard");
      else navigate("/films");  // /films pour Home.jsx
    }
  }, [loading, error, user, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="cinemax-title">Cinéma<span>X</span></h1>
        <h2>Connexion</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group password-field">
            <label>Mot de passe</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          {loading && <p className="loading">🔄 Connexion en cours...</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="redirect">
            Pas encore inscrit ? <Link to="/register">Créer un compte</Link>
          </p>
        </form>
      </div>
    </div>
  );
}