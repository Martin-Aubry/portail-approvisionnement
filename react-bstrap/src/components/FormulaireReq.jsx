import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LotsProvider } from "../context/LotsContext";
import Spinner from "./Spinner";
import Devis from "./Devis";
import Bordereaux from "./Bordereaux";
import Estimes from "./Estimes";
import GanttChart from "./GanttChart";

const FormulaireReq = ({ utilisateur }) => {
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    unite: "",
    objet: "",
    statut: "",
  });

  const [unites, setUnites] = useState([]);
  const [ongletActif, setOngletActif] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unitesRes = await fetch(`${API_URL}/api/unites`);
        const unitesData = await unitesRes.json();
        setUnites(unitesData);

        if (id) {
          const demandeRes = await fetch(`${API_URL}/api/demandes/${id}`);
          const demandeData = await demandeRes.json();
          setFormData({
            unite: demandeData.unite || "",
            objet: demandeData.titre || "",
            statut: demandeData.statut || "",
          });
        }
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, API_URL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = id
      ? `${API_URL}/api/demandes/${id}`
      : `${API_URL}/api/demandes`;

    const method = id ? "PUT" : "POST";
    const statutFinal = id ? formData.statut : "En planification";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: formData.objet,
          statut: statutFinal,
          unite: formData.unite,
          courriel: utilisateur?.courriel,
        }),
      });

      const data = await response.json();
      alert(id ? "Demande mise à jour !" : "Demande ajoutée !");
      console.log(id ? "Demande modifiée :" : "Demande créée :", data);
    } catch (err) {
      console.error("Erreur enregistrement :", err);
      alert("Erreur lors de l'enregistrement de la demande.");
    }
  };

  if (loading) return <Spinner message="Chargement du formulaire..." />;

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center position-relative mb-3">
        <h4>{id ? `Demande : ${id}` : "Nouvelle demande"}</h4>
        <div className="position-absolute top-10 start-50 translate-middle-x">
          <h5 className="mb-0">{id ? `Statut : ${formData.statut}` : ""}</h5>
        </div>
        <div className="ms-auto d-flex gap-3">
          <i
            className={`bi bi-window-dock fs-4 icon-nav ${
              ongletActif === null ? "active" : ""
            }`}
            title="Formulaire"
            onClick={() => setOngletActif(null)}
            style={{ cursor: "pointer" }}
          />
          <i
            className={`bi bi-file-earmark-text fs-4 icon-nav ${
              ongletActif === "devis" ? "active" : ""
            }`}
            title="Devis technique"
            onClick={() => setOngletActif("devis")}
            style={{ cursor: "pointer" }}
          />
          <i
            className={`bi bi-table fs-4 icon-nav ${
              ongletActif === "bordereaux" ? "active" : ""
            }`}
            title="Bordereau de prix"
            onClick={() => setOngletActif("bordereaux")}
            style={{ cursor: "pointer" }}
          />
          <i
            className={`bi bi-calculator fs-4 icon-nav ${
              ongletActif === "estimes" ? "active" : ""
            }`}
            title="Estimation"
            onClick={() => setOngletActif("estimes")}
            style={{ cursor: "pointer" }}
          />
          <i
            className={`bi bi-calendar-range fs-4 icon-nav ${
              ongletActif === "ganttchart" ? "active" : ""
            }`}
            title="Gantt"
            onClick={() => setOngletActif("ganttchart")}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      {!ongletActif && (
        <div className="accordion" id="accordionExample">
          {/* Section Identification */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
              >
                Identification
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show">
              <div className="accordion-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Unité d'affaires</label>
                      <select
                        className="form-select"
                        name="unite"
                        value={formData.unite}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Sélectionner...</option>
                        {unites.map((u) => (
                          <option key={u.id} value={u.nom}>
                            {u.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Sous unité</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Non obligatoire"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Objet</label>
                    <textarea
                      className="form-control"
                      name="objet"
                      value={formData.objet}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Commentaires généraux</label>
                    <textarea
                      className="form-control"
                      placeholder="Facultatif"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Section Paramètres */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
              >
                Paramètres de la demande
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse">
              <div className="accordion-body">
                <div className="mb-3">
                  <label className="form-label">Type de traitement</label>
                  <select className="form-select">
                    <option>Appel d'offres public</option>
                    <option>Appel d'offres sur invitation</option>
                    <option>Gré à gré</option>
                    <option>Avis d'appel d'intérêt</option>
                    <option>Concours d'architecture</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section Risques */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
              >
                Évaluation des risques
              </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse">
              <div className="accordion-body">
                <p>Évaluation à venir...</p>
              </div>
            </div>
          </div>

          <div className="text-end mt-3 mb-3">
            <button className="btn btn-secondary me-2">Annuler</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {ongletActif && (
        <div className="mt-4">
          {ongletActif === "devis" && <Devis />}
          <LotsProvider demandeId={id}>
            {ongletActif === "bordereaux" && <Bordereaux id={id} />}
            {ongletActif === "estimes" && <Estimes />}
          </LotsProvider>
          {ongletActif === "ganttchart" && <GanttChart />}
        </div>
      )}
    </div>
  );
};

export default FormulaireReq;
