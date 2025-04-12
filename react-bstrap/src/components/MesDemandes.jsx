import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const MyDemand = ({ userRole, utilisateur }) => {
  const [demandes, setDemandes] = useState([]);
  const navigate = useNavigate();
  const [totalDemandes, setTotalDemandes] = useState(0);
  const [planifCount, setPlanifCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL; // ✅ À AJOUTER ICI

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/demandes`);
        const data = await res.json();

        let filtered = [];

        if (userRole === "Requérant") {
          const userEmail = utilisateur?.courriel;
          filtered = data.filter((d) => d.courriel === userEmail);
        } else {
          filtered = data;
        }

        setDemandes(filtered);

        setTotalDemandes(filtered.length);
        setPlanifCount(
          filtered.filter((d) => d.statut === "En planification").length
        );
      } catch (err) {
        console.error("Erreur lors du fetch des demandes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, [userRole, utilisateur]);

  if (loading) {
    return <Spinner message="Chargement des demandes..." />;
  }

  return (
    <div className="container-fluid">
      <div className="row align-items-center mb-3">
        <div className="col-md-3 d-flex align-items-center">
          <h4 className="mb-0">Mes demandes</h4>
          <i
            className="bi bi-funnel ms-3 fs-4"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample"
            style={{
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.2)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          ></i>
        </div>

        <div className="col-md-6 d-flex justify-content-center gap-5">
          <div className="text-center">
            <i className="bi bi-hourglass-split fs-4 text-primary"></i>
            <div className="small">En cours</div>
            <strong>8</strong>
          </div>
          <div className="text-center">
            <i className="bi bi-calendar-check fs-4 text-warning"></i>
            <div className="small">Planif.</div>
            <strong>{planifCount}</strong>
          </div>
          <div className="text-center">
            <i className="bi bi-list-check fs-4 text-success"></i>
            <div className="small">Total</div>
            <strong>{totalDemandes}</strong>
          </div>
        </div>

        <div className="col-md-3 d-flex justify-content-end">
          <Link to="/formulaire" className="btn btn-outline-primary">
            Nouvelle demande
          </Link>
        </div>
      </div>

      <div className="collapse" id="collapseExample">
        <div className="card card-body">Filtres à venir ici.</div>
      </div>

      <table className="table table-striped table-bordered table-hover mt-3">
        <thead>
          <tr>
            <th scope="col">No demande</th>
            <th scope="col">Unité d'affaires</th>
            <th scope="col">Objet de la demande</th>
            <th scope="col">Statut</th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((demande) => (
            <tr
              key={demande.id}
              onClick={() => navigate(`/formulaire/${demande.id}`)}
              style={{ cursor: "pointer" }}
            >
              <th scope="row">{demande.id}</th>
              <td>{demande.unite}</td>
              <td>{demande.titre}</td>
              <td>{demande.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyDemand;
