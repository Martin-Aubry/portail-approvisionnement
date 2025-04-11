import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Login = ({ onLogin }) => {
  const [courriel, setCourriel] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ empêche le rechargement de page

    const { data, error } = await supabase.auth.signInWithPassword({
      email: courriel,
      password: motDePasse,
    });

    if (error) {
      alert("Erreur de connexion : " + error.message);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/utilisateurs-par-courriel/${courriel}`
      );
      const utilisateurComplet = await res.json();
      onLogin(utilisateurComplet);
      navigate("/");
    } catch (err) {
      console.error("Erreur récupération utilisateur:", err);
      alert("Impossible de récupérer les informations de l'utilisateur.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #e0ecf7, #f8f9fa)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="card p-4 shadow-lg border-0"
        style={{ width: "100%", maxWidth: "420px", borderRadius: "12px" }}
      >
        <div className="text-center mb-4">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ maxWidth: "100px", height: "auto" }}
            className="mb-3"
          />
          <h4 className="fw-bold text-primary">Portail approvisionnement</h4>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="courriel" className="form-label fw-medium">
              Courriel
            </label>
            <input
              type="email"
              id="courriel"
              className="form-control text-center"
              placeholder="Entrez votre courriel"
              value={courriel}
              onChange={(e) => setCourriel(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="motdepasse" className="form-label fw-medium">
              Mot de passe
            </label>
            <input
              type="password"
              id="motdepasse"
              className="form-control text-center"
              placeholder="●●●●●●"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 shadow-sm"
            disabled={!courriel || !motDePasse}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
