import { useState } from "react";

const ConfigListesValeurs = ({ unites, setUnites }) => {
  const [nouvelleUnite, setNouvelleUnite] = useState("");
  const [uniteEnEdition, setUniteEnEdition] = useState(null);
  const [nomEdition, setNomEdition] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

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

  return (
    <div>
      <h3 className="mb-3">Unités d'affaires</h3>

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
    </div>
  );
};

export default ConfigListesValeurs;
