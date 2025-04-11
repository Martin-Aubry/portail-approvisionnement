import React, { useEffect, useState } from "react";
import SkeletonCard from "./SkeletonCard";
import { supabase } from "../supabaseClient";

const Users = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    courriel: "",
    mot_de_passe: "",
    roles: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          fetch("http://localhost:3001/api/utilisateurs"),
          fetch("http://localhost:3001/api/roles"),
        ]);

        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();

        setUtilisateurs(usersData);
        setRoles(rolesData);
      } catch (err) {
        console.error("Erreur fetch utilisateurs ou rôles :", err);
      } finally {
        setLoading(false); // ✅ Important : désactiver le skeleton
      }
    };

    fetchData();
  }, []);

  const handleRowClick = async (user) => {
    const res = await fetch(
      `http://localhost:3001/api/utilisateurs/${user.id}/roles`
    );
    const userRoles = await res.json();
    setSelectedUser(user);
    setFormData({
      nom: user.nom,
      courriel: user.courriel,
      mot_de_passe: user.mot_de_passe,
      roles: userRoles.map((r) => r.id),
    });
    setFormVisible(true);
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setFormData({ nom: "", courriel: "", mot_de_passe: "", roles: [] });
    setFormVisible(true);
  };

  const handleCheckboxChange = (roleId) => {
    setFormData((prev) => {
      const alreadyChecked = prev.roles.includes(roleId);
      return {
        ...prev,
        roles: alreadyChecked
          ? prev.roles.filter((id) => id !== roleId)
          : [...prev.roles, roleId],
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nom, courriel, mot_de_passe, roles } = formData;

    if (mot_de_passe.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const method = selectedUser ? "PUT" : "POST";
    const url = selectedUser
      ? `http://localhost:3001/api/utilisateurs/${selectedUser.id}`
      : "http://localhost:3001/api/utilisateurs";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          courriel,
          mot_de_passe,
          roles, // 👈 on envoie les rôles directement
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert("Erreur : " + (errData.error || "Erreur inconnue"));
        return;
      }

      alert("Utilisateur sauvegardé !");
      setFormVisible(false);

      const updatedUsers = await fetch(
        "http://localhost:3001/api/utilisateurs"
      );
      const data = await updatedUsers.json();
      setUtilisateurs(data);
    } catch (err) {
      console.error("Erreur lors de l'envoi du formulaire :", err);
      alert("Une erreur est survenue.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Confirmer la suppression ?")) {
      console.log("👉 Data envoyée au backend :", formData);

      await fetch(`http://localhost:3001/api/utilisateurs/${selectedUser.id}`, {
        method: "DELETE",
      });
      alert("Utilisateur supprimé");
      setFormVisible(false);
      const updatedUsers = await fetch(
        "http://localhost:3001/api/utilisateurs"
      );
      const data = await updatedUsers.json();
      setUtilisateurs(data);
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    setSelectedUser(null);
    setFormData({ nom: "", courriel: "", mot_de_passe: "", roles: [] });
  };

  if (loading) {
    return (
      <div className="container mt-4">
        {[...Array(5)].map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (!formVisible) {
    return (
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Utilisateurs</h2>
          <button className="btn btn-primary" onClick={handleAddClick}>
            Ajouter un utilisateur
          </button>
        </div>
        <table className="table table-striped table-bordered table-hover mt-3">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Courriel</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user)}
                style={{ cursor: "pointer" }}
              >
                <td>{user.nom}</td>
                <td>{user.courriel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <h3>
        {selectedUser
          ? `Modifier ${selectedUser.nom}`
          : "Ajouter un utilisateur"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nom</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Courriel</label>
          <input
            type="email"
            className="form-control"
            name="courriel"
            value={formData.courriel}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Rôles :</label>
          {roles.map((role) => (
            <div key={role.id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={formData.roles.includes(role.id)}
                onChange={() => handleCheckboxChange(role.id)}
                id={`role-${role.id}`}
              />
              <label className="form-check-label" htmlFor={`role-${role.id}`}>
                {role.role_nom}
              </label>
            </div>
          ))}
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {selectedUser ? "Mettre à jour" : "Ajouter"}
          </button>
          {selectedUser && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Supprimer
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default Users;
