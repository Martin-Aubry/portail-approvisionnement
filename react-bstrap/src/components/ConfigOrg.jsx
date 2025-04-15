import React, { useState } from "react";

const ConfigOrg = () => {
  const [form, setForm] = useState({
    nomLegal: "",
    typeOrganisation: "Municipalité",
    adresse: "",
    facturation: "",
    taille: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const enregistrerOrganisation = async () => {
    try {
      const response = await fetch(`${API_URL}/api/organisations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");

      const resultat = await response.json();
      alert("Organisation enregistrée avec succès!");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await enregistrerOrganisation();
  };

  return (
    <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
      <h4 className="mb-3">Informations de l'organisation</h4>

      <div className="mb-3">
        <label className="form-label">Nom légal</label>
        <input
          type="text"
          className="form-control"
          name="nomLegal"
          value={form.nomLegal}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Type d’organisation</label>
        <select
          className="form-select"
          name="typeOrganisation"
          value={form.typeOrganisation}
          onChange={handleChange}
        >
          <option value="Municipalité">Municipalité</option>
          <option value="Organisation paramunicipale">
            Organisation paramunicipale
          </option>
          <option value="Ministère">Ministère</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Adresse</label>
        <input
          type="text"
          className="form-control"
          name="adresse"
          value={form.adresse}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Données pour facturation</label>
        <textarea
          className="form-control"
          name="facturation"
          rows={3}
          value={form.facturation}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Taille (nombre d’employés)</label>
        <input
          type="number"
          className="form-control"
          name="taille"
          value={form.taille}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary mt-2">
        Enregistrer
      </button>
    </form>
  );
};

export default ConfigOrg;
