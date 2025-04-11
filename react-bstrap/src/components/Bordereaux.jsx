import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { LotsContext } from "../context/LotsContext";

export default function Bordereaux() {
  const { id } = useParams(); // ✅ Un seul endroit pour récupérer l'id de la demande
  const [descriptionLot, setDescriptionLot] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [cibleSuppression, setCibleSuppression] = useState(null); // { type: "item" | "lot", indices: {...} }
  const { lots, setLots } = useContext(LotsContext);

  const supprimerLot = (lotIndex) => {
    const updatedLots = [...lots];
    updatedLots.splice(lotIndex, 1);
    setLots(updatedLots);
  };

  const confirmerSuppression = (type, indices) => {
    setCibleSuppression({ type, indices });
    setModalVisible(true);
  };

  const annulerSuppression = () => {
    setModalVisible(false);
    setCibleSuppression(null);
  };

  const executerSuppression = async () => {
    if (!cibleSuppression) return;

    const { type, indices } = cibleSuppression;

    try {
      const updatedLots = [...lots];

      if (type === "item") {
        const { lotIndex, itemIndex } = indices;
        const itemId = updatedLots[lotIndex].items[itemIndex]?.id;

        if (itemId) {
          await fetch(`http://localhost:3001/api/items/${itemId}`, {
            method: "DELETE",
          });
        }

        updatedLots[lotIndex].items.splice(itemIndex, 1);
        setLots(updatedLots);
      }

      if (type === "lot") {
        const { lotIndex } = indices;
        const lotId = updatedLots[lotIndex]?.id;

        if (lotId) {
          await fetch(`http://localhost:3001/api/lots/${lotId}`, {
            method: "DELETE",
          });
        }

        updatedLots.splice(lotIndex, 1);
        setLots(updatedLots);
      }

      annulerSuppression(); // Ferme le modal
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const ajouterLot = () => {
    if (!descriptionLot.trim()) return;
    const nouveauLot = {
      numero: lots.length + 1,
      description: descriptionLot,
      items: [],
    };
    setLots([...lots, nouveauLot]);
    setDescriptionLot("");
  };

  const ajouterItemAuLot = (lotIndex) => {
    const nouveauItem = {
      description: "", // ✅ correspond à la BDD
      quantite: "",
      unite: "",
      prixUnitaire: "",
    };
    const updatedLots = [...lots];
    updatedLots[lotIndex].items.push(nouveauItem);
    setLots(updatedLots);
  };

  const handleItemChange = (lotIndex, itemIndex, field, value) => {
    const updatedLots = [...lots];
    updatedLots[lotIndex].items[itemIndex][field] = value;
    setLots(updatedLots);
  };

  const calculerMontant = (item) => {
    const qte = parseFloat(item.quantite);
    const prix = parseFloat(item.prixUnitaire);
    return isNaN(qte) || isNaN(prix) ? "" : (qte * prix).toFixed(2);
  };

  const sauvegarderBordereaux = async () => {
    try {
      const lotsFormates = lots.map((lot) => ({
        id: lot.id,
        description: lot.description,
        items: lot.items.map((item) => ({
          id: item.id,
          description: item.description, // ✅ OK maintenant
          quantite: parseFloat(item.quantite),
          unite: item.unite,
          prixUnitaire: parseFloat(item.prixUnitaire),
        })),
      }));

      console.log("📦 Lots à sauvegarder :", lotsFormates);

      const response = await fetch(
        `http://localhost:3001/api/demandes/${id}/bordereaux`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lots: lotsFormates }),
        }
      );

      const result = await response.json();
      console.log("✅ Bordereaux sauvegardés :", result);
      alert("Bordereaux sauvegardés avec succès !");
    } catch (error) {
      console.error("❌ Erreur de sauvegarde :", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="mb-3">Bordereaux de prix</h2>

      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-end mb-1">
          <label className="form-label">Description du lot</label>
          <button className="btn btn-primary mb-2" onClick={ajouterLot}>
            Ajouter un lot
          </button>
        </div>
        <input
          type="text"
          className="form-control"
          value={descriptionLot}
          onChange={(e) => setDescriptionLot(e.target.value)}
        />
      </div>

      {lots.map((lot, lotIndex) => (
        <div key={lot.id || `lot-${lotIndex}`} className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">
              Lot #{lot.numero} - {lot.description}
            </h5>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={() => ajouterItemAuLot(lotIndex)}
              >
                Ajouter un item
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => confirmerSuppression("lot", { lotIndex })}
              >
                Supprimer le lot
              </button>
            </div>
          </div>

          <table className="table table-bordered mt-2">
            <thead className="table-secondary">
              <tr>
                <th>Numéro d'item</th>
                <th>Description d'item</th>
                <th>Quantité prévisionnelle</th>
                <th>Unité de mesure</th>
                <th>Prix unitaire</th>
                <th>Montant total (Sans taxes)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lot.items.map((item, itemIndex) => (
                <tr key={item.id || `${lotIndex}-${itemIndex}`}>
                  <td>{itemIndex + 1}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(
                          lotIndex,
                          itemIndex,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={item.quantite}
                      onChange={(e) =>
                        handleItemChange(
                          lotIndex,
                          itemIndex,
                          "quantite",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={item.unite}
                      onChange={(e) =>
                        handleItemChange(
                          lotIndex,
                          itemIndex,
                          "unite",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={item.prixUnitaire}
                      onChange={(e) =>
                        handleItemChange(
                          lotIndex,
                          itemIndex,
                          "prixUnitaire",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>{calculerMontant(item)} $</td>
                  <td className="text-center">
                    <i
                      className="bi bi-trash text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        confirmerSuppression("item", { lotIndex, itemIndex })
                      }
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      {lots.length > 0 && (
        <div className="d-flex justify-content-end mt-4 mb-5">
          <button className="btn btn-primary" onClick={sauvegarderBordereaux}>
            Enregistrer
          </button>
        </div>
      )}

      {modalVisible && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={annulerSuppression}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Êtes-vous sûr de vouloir supprimer ce{" "}
                  {cibleSuppression?.type === "item" ? "item" : "lot"} ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={annulerSuppression}
                >
                  Annuler
                </button>
                <button
                  className="btn btn-primary"
                  onClick={executerSuppression}
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
