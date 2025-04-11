import { LotsProvider } from "../context/LotsContext";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GanttChart from "./GanttChart";
import Devis from "./Devis";
import Estimes from "./Estimes";
import Bordereaux from "./Bordereaux";
import Spinner from "./Spinner";

const FormulaireReq = ({ utilisateur }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    unite: "",
    objet: "",
    statut: "",
  });

  const [unites, setUnites] = useState([]);
  const [ongletActif, setOngletActif] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Toujours faire ce fetch, qu'on soit en création ou édition
    fetch("http://localhost:3001/api/unites")
      .then((res) => res.json())
      .then((data) => setUnites(data))
      .catch((err) => console.error("Erreur fetch unités:", err));
  }, []); // 👈 s'exécute une seule fois au montage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unitesRes = await fetch("http://localhost:3001/api/unites");
        const unitesData = await unitesRes.json();
        setUnites(unitesData);

        if (id) {
          const demandeRes = await fetch(
            `http://localhost:3001/api/demandes/${id}`
          );
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
        setLoading(false); // ✅ Toujours désactiver le loading
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const url = id
      ? `http://localhost:3001/api/demandes/${id}`
      : "http://localhost:3001/api/demandes";

    const method = id ? "PUT" : "POST";

    const statutFinal = id ? formData.statut : "En planification";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titre: formData.objet,
        statut: statutFinal,
        unite: formData.unite,
        courriel: utilisateur.courriel,
      }),
    });

    const data = await response.json();
    console.log(id ? "Demande modifiée :" : "Demande créée :", data);
    alert(id ? "Demande mise à jour !" : "Demande ajoutée !");
  };

  if (loading) {
    return <Spinner message="Chargement du formulaire..." />;
  }

  return (
    <div className="container-fluid mt-4">
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center position-relative">
            {/* Titre + Calendrier */}
            <div className="d-flex align-items-center">
              <h4>{id ? `Demande : ${id}` : "Nouvelle demande"}</h4>
            </div>
            <div className="position-absolute top-10 start-50 translate-middle-x">
              <h4 className="mb-0">
                {id ? `Statut : ${formData.statut}` : ""}
              </h4>
            </div>

            {/* Icônes à droite */}
            <div className="ms-auto d-flex gap-3">
              <i
                className={`bi bi-window-dock fs-4 icon-nav ${
                  ongletActif === null ? "active" : ""
                }`}
                title="Formulaire"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setOngletActif(null)}
              />
              <i
                className={`bi bi-file-earmark-text fs-4 icon-nav ${
                  ongletActif === "devis" ? "active" : ""
                }`}
                title="Devis technique"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => setOngletActif("devis")}
              />
              <i
                className={`bi bi-table fs-4 icon-nav ${
                  ongletActif === "bordereaux" ? "active" : ""
                }`}
                title="Bordereau de prix"
                style={{ cursor: "pointer" }}
                onClick={() => setOngletActif("bordereaux")}
              />

              <i
                className={`bi bi-calculator fs-4 icon-nav ${
                  ongletActif === "estimes" ? "active" : ""
                }`}
                title="Estimation"
                style={{ cursor: "pointer" }}
                onClick={() => setOngletActif("estimes")}
              />

              <i
                className={`bi bi-calendar-range fs-4 icon-nav ${
                  ongletActif === "ganttchart" ? "active" : ""
                }`}
                title="Gantt de la demande"
                style={{ cursor: "pointer" }}
                onClick={() => setOngletActif("ganttchart")}
              />
            </div>
          </div>
        </div>
      </div>

      {!ongletActif && (
        <div className="accordion mt-2" id="accordionExample">
          <div className="accordion-item section-identification">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Identification
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              data-bs-parent="#accordionExample"
            >
              <div className="container-fluid  mt-3">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label has-float-label">
                        <select
                          className="form-select"
                          name="unite"
                          value={formData.unite}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Sélectionner...</option>
                          {unites.map((unite) => (
                            <option key={unite.id} value={unite.nom}>
                              {unite.nom}
                            </option>
                          ))}
                        </select>
                        <span>Unité d'affaires</span>
                      </label>
                    </div>

                    <div className="col-md-3 mr-2">
                      <label className="form-group has-float-label">
                        <input
                          className="form-control formAO"
                          id="aideNom"
                          type="text"
                          placeholder="Sous unité d'affaires"
                        />
                        <span>Sous unité d'affaires</span>
                      </label>
                    </div>
                  </div>
                  <div className=" mt-1 row">
                    <div className=" bigBox-size mr-2">
                      <label className="form-label has-float-label">
                        <textarea
                          type="text"
                          placeholder="Objet de la demande"
                          className="form-control"
                          name="objet"
                          value={formData.objet}
                          onChange={handleChange}
                          required
                        />
                        <span>Objet de la demande</span>
                      </label>
                    </div>
                    <div className=" bigBox-size mt-1">
                      <label className="form-label has-float-label">
                        <textarea
                          type="text"
                          placeholder="Commentaires généraux"
                          className="form-control"
                          name="objet"
                          required
                        />
                        <span>Commentaires généraux</span>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="accordion-item section-parametres">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Paramètres de la demande
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="container-fluid mt-3">
                {/* Ligne 1 */}
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">
                      Type de traitement souhaité
                    </label>
                    <select className="form-select">
                      <option value="">Sélectionner...</option>
                      <option value="Appel d'offres public">
                        Appel d'offres public
                      </option>
                      <option value="Appel d'offres sur invitation">
                        Appel d'offres sur invitation
                      </option>
                      <option value="Avis d'appel d'intérêt">
                        Avis d'appel d'intérêt
                      </option>
                      <option value="Avis d'appel d'intention">
                        Avis d'appel d'intention
                      </option>
                      <option value="Gré à gré">Gré à gré</option>
                      <option value="Concours d'architecture">
                        Concours d'architecture
                      </option>
                    </select>
                  </div>
                </div>

                {/* Ligne 2 : Clé comptable */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Clé comptable reliée à cet achat
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>

                {/* Ligne 3 : Soumissions reçues */}
                <div className="mb-3">
                  <label className="form-label">
                    Avez-vous déjà reçu des soumissions ?
                  </label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="soumission"
                      id="soumissionOui"
                      value="Oui"
                    />
                    <label className="form-check-label" htmlFor="soumissionOui">
                      Oui
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="soumission"
                      id="soumissionNon"
                      value="Non"
                    />
                    <label className="form-check-label" htmlFor="soumissionNon">
                      Non
                    </label>
                  </div>
                </div>

                {/* Lien vers estimation */}
              </div>

              <div className="accordion-body"></div>
            </div>
          </div>
          <div className="accordion-item section-risques">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Évaluation des risques et des opportunités
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body"></div>
            </div>
          </div>
          <div className="text-end mt-3 mb-3">
            <button className="btn btn-danger me-2">Annuler</button>
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
            {ongletActif === "estimes" && <Estimes />}
            {ongletActif === "bordereaux" && <Bordereaux id={id} />}
          </LotsProvider>
          {ongletActif === "ganttchart" && <GanttChart />}
        </div>
      )}
    </div>
  );
};

export default FormulaireReq;
