import { useContext, useEffect, useState } from "react";
import { LotsContext } from "../context/LotsContext";

const Estimes = () => {
  const { lots } = useContext(LotsContext);

  const [prolongation, setProlongation] = useState(0);
  const [nomAuteur, setNomAuteur] = useState("");
  const [estimationTotaleAvecTaxes, setEstimationTotaleAvecTaxes] = useState(0);

  const TAX_RATE = 1.1495;

  useEffect(() => {
    const totalSansTaxes = lots.reduce((acc, lot) => {
      const lotTotal = lot.items?.reduce((sum, item) => {
        const qte = parseFloat(item.quantite);
        const prix = parseFloat(item.prixUnitaire);
        return !isNaN(qte) && !isNaN(prix) ? sum + qte * prix : sum;
      }, 0);
      return acc + lotTotal;
    }, 0);

    const totalAvecTaxes = (totalSansTaxes * TAX_RATE).toFixed(2);
    setEstimationTotaleAvecTaxes(totalAvecTaxes);
  }, [lots]);

  const formatMontant = (montant) =>
    new Intl.NumberFormat("fr-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
    }).format(montant);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Estimé</h3>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">
            Montant de l'estimation avec les taxes
          </label>
          <input
            type="text"
            className="form-control"
            value={`${new Intl.NumberFormat("fr-CA", {
              style: "currency",
              currency: "CAD",
              minimumFractionDigits: 2,
            }).format(estimationTotaleAvecTaxes)}`}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">
            Montant de l'estimation des prolongation(s) avec taxes
          </label>
          <input
            type="number"
            className="form-control"
            value={prolongation}
            onChange={(e) => setProlongation(e.target.value)}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">
            Montant de l'estimation incluant les prolongation(s)
          </label>
          <input
            type="text"
            className="form-control"
            value={formatMontant(
              parseFloat(estimationTotaleAvecTaxes || 0) +
                parseFloat(prolongation || 0)
            )}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">
            Nom complet de l'auteur de l'estimé
          </label>
          <input
            type="text"
            className="form-control"
            value={nomAuteur}
            onChange={(e) => setNomAuteur(e.target.value)}
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button className="btn btn-outline-primary">
          Envoyer pour approbation
        </button>
        <button className="btn btn-success">Approuver</button>
      </div>
    </div>
  );
};

export default Estimes;
