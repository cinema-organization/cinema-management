import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/userSlice";  // Utilise le thunk
import "../styles/auth.css";

export default function Register() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);  // Nouveau: track si submit a eu lieu
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isLoggedIn } = useSelector((state) => state.auth);  // Ajoute isLoggedIn

  const checkStrength = (pwd) => {
    if (pwd.length < 6) return "Faible";
    if (pwd.length >= 12 && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[@$!%*?&]/.test(pwd)) return "Forte";
    return "Moyenne";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Fix: Utilise un alert ou set local error (pas dispatch type, car pas de reducer setError)
      alert("❌ Les mots de passe ne correspondent pas.");  // Ou intègre un state local error
      return;
    }
    setSubmitted(true);  // Marque submit
    dispatch(registerUser({ nom, email, password }));  // Dispatch thunk
  };

  // Nav après succès - Fix: seulement après submitted + succès (isLoggedIn true)
  useEffect(() => {
    if (submitted && !loading && !error && isLoggedIn) {
      navigate("/films");  // Nav seulement après submit réussi
    } else if (submitted && !loading && error) {
      setSubmitted(false);  // Reset pour nouveau submit si erreur
    }
  }, [loading, error, isLoggedIn, submitted, navigate]);

  const strength = checkStrength(password);
  const strengthClass = strength === "Forte" ? "strong" : strength === "Moyenne" ? "medium" : "weak";

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="cinemax-title">Cinéma<span>X</span></h1>
        <h2>Inscription</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              placeholder="Votre nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              disabled={loading}
            />
          </div>

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
                minLength="6"
                disabled={loading}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>
            {password && (
              <p className={`strength ${strengthClass}`}>
                Force du mot de passe : {strength}
              </p>
            )}
          </div>

          <div className="form-group password-field">
            <label>Confirmer le mot de passe</label>
            <div className="password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          {loading && <p className="loading">🔄 Inscription en cours...</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Inscription..." : "S’inscrire"}
          </button>

          <p className="redirect">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}