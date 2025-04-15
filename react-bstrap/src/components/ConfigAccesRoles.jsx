import { useEffect, useState } from "react";

const ConfigAccesRoles = ({ API_URL }) => {
  const [roles, setRoles] = useState([]);
  const [ecrans, setEcrans] = useState([]);
  const [accesRolesEcrans, setAccesRolesEcrans] = useState([]);
  const [nouveauRole, setNouveauRole] = useState("");
  const [prioriteRole, setPrioriteRole] = useState(99);

  useEffect(() => {
    console.log("✅ API_URL reçu :", API_URL);
    const fetchAll = async () => {
      try {
        const [rolesRes, ecransRes, accesRes] = await Promise.all([
          fetch(`${API_URL}/api/roles`),
          fetch(`${API_URL}/api/ecrans`),
          fetch(`${API_URL}/api/acces-role-ecran`),
        ]);

        // Vérifie si les réponses sont du JSON
        const checkJson = async (res) => {
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("❌ Réponse inattendue:", text);
            throw new Error("Réponse non JSON reçue.");
          }
          return res.json();
        };

        const rolesData = await checkJson(rolesRes);
        const ecransData = await checkJson(ecransRes);
        const accesData = await checkJson(accesRes);

        setRoles(rolesData);
        setEcrans(ecransData);
        setAccesRolesEcrans(accesData);
      } catch (err) {
        console.error("❌ Erreur chargement rôles/accès:", err);
      }
    };

    fetchAll();
  }, [API_URL]);

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

  const ajouterRole = async () => {
    if (!nouveauRole.trim()) return;

    const res = await fetch(`${API_URL}/api/roles`, {
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
    <div>
      <h3 className="mt-5">Gestion des accès par rôle</h3>
      <h4 className="mt-3">Ajouter un rôle</h4>
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

export default ConfigAccesRoles;
