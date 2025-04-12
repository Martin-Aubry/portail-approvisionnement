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

  const API_URL = import.meta.env.VITE_API_URL;

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
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const url = id
      ? `${API_URL}/api/demandes/${id}`
      : `${API_URL}/api/demandes`;

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

  if (loading) return <Spinner message="Chargement du formulaire..." />;

  return (
    <div className="container-fluid mt-4">
      {/* ✅ Le reste de ton formulaire reste inchangé */}
      {/* ... */}
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
