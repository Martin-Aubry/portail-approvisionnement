import { useState, useEffect } from "react";

const Config = () => {
  const [unites, setUnites] = useState([]);
  const [nouvelleUnite, setNouvelleUnite] = useState("");
  const [uniteEnEdition, setUniteEnEdition] = useState(null);
  const [nomEdition, setNomEdition] = useState("");
  const [roles, setRoles] = useState([]);
  const [ecrans, setEcrans] = useState([]);
  const [accesRolesEcrans, setAccesRolesEcrans] = useState([]);
  const [nouveauRole, setNouveauRole] = useState("");
  const [prioriteRole, setPrioriteRole] = useState(99);
  const API_URL = import.meta.env.VITE_API_URL; // ✅ À AJOUTER ICI

  useEffect(() => {
    fetch(`${API_URL}/api/unites`)
      .then((res) => res.json())
      .then((data) => setUnites(data))
      .catch((err) => console.error("Erreur fetch unites:", err));
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/roles`).then((res) => res.json()),
      fetch(`${API_URL}/api/ecrans`).then((res) => res.json()),
      fetch(`${API_URL}/api/acces-role-ecran`).then((res) => res.json()),
    ])
      .then(([rolesData, ecransData, accesData]) => {
        setRoles(rolesData);
        setEcrans(ecransData);
        setAccesRolesEcrans(accesData);
      })
      .catch((err) => console.error("Erreur chargement accès par rôle:", err));
  }, []);

  const toggleAccesRoleEcran = async (roleId, ecranId) => {
    const existe = accesRolesEcrans.find(
      (a) => a.roleId === roleId && a.ecranId === ecranId
    );

    if (existe) {
      await fetch(`${API_URL}/api/acces-role-ecran`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, ecranId }),
      });
      setAccesRolesEcrans(
        accesRolesEcrans.filter(
          (a) => !(a.roleId === roleId && a.ecranId === ecranId)
        )
      );
    } else {
      const res = await fetch(`${API_URL}/api/acces-role-ecran`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, ecranId }),
      });
      const data = await res.json();
      setAccesRolesEcrans([...accesRolesEcrans, data]);
    }
  };

  const ajouterUnite = async () => {
    if (!nouvelleUnite.trim()) return;

    const res = await fetch(`${API_URL}/api/unites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: nouvelleUnite }),
    });

    const data = await res.json();
    setUnites([...unites, data]);
    setNouvelleUnite("");
  };

  const supprimerUnite = async (id) => {
    await fetch(`${API_URL}/api/unites/${id}`, {
      method: "DELETE",
    });
    setUnites(unites.filter((u) => u.id !== id));
  };

  const enregistrerModification = async () => {
    const res = await fetch(`${API_URL}/api/unites/${uniteEnEdition}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: nomEdition }),
    });

    const data = await res.json();
    setUnites(unites.map((u) => (u.id === data.id ? data : u)));
    setUniteEnEdition(null);
    setNomEdition("");
  };

  const ajouterRole = async () => {
    if (!nouveauRole.trim()) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role_nom: nouveauRole,
        priorite: parseInt(prioriteRole),
      }),
    });

    const data = await res.json();
    setRoles([...roles, data]);
    setNouveauRole("");
    setPrioriteRole(99);
  };

  return (
    <div className="container-fluid mt-4">
      <h2>Configuration des unités d'affaires</h2>

      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Ajouter une unité"
          value={nouvelleUnite}
          onChange={(e) => setNouvelleUnite(e.target.value)}
        />
        <button className="btn btn-primary" onClick={ajouterUnite}>
          Ajouter
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {unites.map((unite) => (
            <tr key={unite.id}>
              <td>
                {uniteEnEdition === unite.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={nomEdition}
                    onChange={(e) => setNomEdition(e.target.value)}
                  />
                ) : (
                  unite.nom
                )}
              </td>
              <td>
                {uniteEnEdition === unite.id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={enregistrerModification}
                    >
                      Enregistrer
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setUniteEnEdition(null)}
                    >
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setUniteEnEdition(unite.id);
                        setNomEdition(unite.nom);
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => supprimerUnite(unite.id)}
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="mt-5">Gestion des accès par rôle</h2>
      <h2 className="mt-5">Ajouter un rôle</h2>
      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nom du rôle"
          value={nouveauRole}
          onChange={(e) => setNouveauRole(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Priorité"
          value={prioriteRole}
          onChange={(e) => setPrioriteRole(e.target.value)}
        />
        <button className="btn btn-primary" onClick={ajouterRole}>
          Ajouter le rôle
        </button>
      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Écran</th>
            {roles.map((role) => (
              <th key={role.id}>{role.role_nom}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ecrans.map((ecran) => (
            <tr key={ecran.id}>
              <td>{ecran.nom}</td>
              {roles.map((role) => {
                const hasAccess = accesRolesEcrans.some(
                  (a) => a.roleId === role.id && a.ecranId === ecran.id
                );
                return (
                  <td key={role.id}>
                    <input
                      type="checkbox"
                      checked={hasAccess}
                      onChange={() => toggleAccesRoleEcran(role.id, ecran.id)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Config;
