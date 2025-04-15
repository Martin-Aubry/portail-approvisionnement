import { useState, useEffect } from "react";
import ConfigAccesRoles from "./ConfigAccesRoles";
import ConfigListesValeurs from "./ConfigListesValeurs";
import ConfigOrg from "./ConfigOrg";
import SkeletonCard from "./SkeletonCard";

const Config = () => {
  const [unites, setUnites] = useState([]);
  const [roles, setRoles] = useState([]);
  const [ecrans, setEcrans] = useState([]);
  const [accesRolesEcrans, setAccesRolesEcrans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ongletActif, setOngletActif] = useState("organisation");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/unites`).then((res) => res.json()),
      fetch(`${API_URL}/api/roles`).then((res) => res.json()),
      fetch(`${API_URL}/api/ecrans`).then((res) => res.json()),
      fetch(`${API_URL}/api/acces-role-ecran`).then((res) => res.json()),
    ])
      .then(([unitesData, rolesData, ecransData, accesData]) => {
        setUnites(unitesData);
        setRoles(rolesData);
        setEcrans(ecransData);
        setAccesRolesEcrans(accesData);
      })
      .catch((err) => console.error("Erreur chargement config:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container mt-4">
        {[...Array(3)].map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Configuration</h3>
        <div className="ms-auto d-flex gap-3">
          <i
            className={`bi bi-building-gear fs-4 icon-nav ${
              ongletActif === "organisation" ? "active" : ""
            }`}
            title="Organisation"
            style={{ cursor: "pointer" }}
            onClick={() => setOngletActif("organisation")}
          />
          <i
            className={`bi bi-list-columns fs-4 icon-nav ${
              ongletActif === "valeurs" ? "active" : ""
            }`}
            title="Listes de valeurs"
            style={{ cursor: "pointer" }}
            onClick={() => setOngletActif("valeurs")}
          />
          <i
            className={`bi bi-person-gear fs-4 icon-nav ${
              ongletActif === "acces" ? "active" : ""
            }`}
            title="Gestion des accès"
            style={{ cursor: "pointer" }}
            onClick={() => setOngletActif("acces")}
          />
        </div>
      </div>

      {ongletActif === "organisation" && <ConfigOrg />}
      {ongletActif === "valeurs" && (
        <ConfigListesValeurs unites={unites} setUnites={setUnites} />
      )}
      {ongletActif === "acces" && (
        <ConfigAccesRoles
          roles={roles}
          ecrans={ecrans}
          accesRolesEcrans={accesRolesEcrans}
          setRoles={setRoles}
          setAccesRolesEcrans={setAccesRolesEcrans}
          API_URL={API_URL} // ✅ AJOUT ICI
        />
      )}
    </div>
  );
};

export default Config;
