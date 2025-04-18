import { useEffect, useState } from "react";

const SEAO = () => {
  const [data, setData] = useState([]);
  const [releases, setReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [filters, setFilters] = useState({
    keyword: "",
    orgName: "",
    minAmount: "",
  });

  useEffect(() => {
    fetch("/data/seao.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data.releases);
        setReleases(data.releases.slice(0, 100));
        setIsLoading(false);
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const { keyword, orgName, minAmount } = filters;
    const filtered = data.filter((release) => {
      const title = release.tender?.title?.toLowerCase() || "";
      const buyer = release.buyer?.name?.toLowerCase() || "";
      const amount = release.awards?.[0]?.value?.amount || 0;

      return (
        title.includes(keyword.toLowerCase()) &&
        buyer.includes(orgName.toLowerCase()) &&
        (!minAmount || amount >= parseFloat(minAmount))
      );
    });

    setReleases(filtered.slice(0, 100));
  };

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="container mt-4">
      {/* Titre + Icônes */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Contrats SEAO</h2>
        <div className="d-flex gap-3">
          <i
            className="bi bi-file-earmark-text fs-4"
            title="Rapport"
            style={{ cursor: "pointer" }}
          />
          <i
            className="bi bi-bar-chart-line fs-4"
            title="Tableau de bord"
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      {/* Filtres */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            name="keyword"
            className="form-control"
            placeholder="Mot-clé"
            value={filters.keyword}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="orgName"
            className="form-control"
            placeholder="Organisation"
            value={filters.orgName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            name="minAmount"
            className="form-control"
            placeholder="Montant minimum"
            value={filters.minAmount}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Rechercher
          </button>
        </div>
      </div>

      {/* Tableau */}
      <table className="table table-hover table-bordered table-striped">
        <thead>
          <tr>
            <th>OCID</th>
            <th>Titre</th>
            <th>Organisation</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => (
            <tr
              key={release.ocid}
              onClick={() => setSelectedRelease(release)}
              style={{ cursor: "pointer" }}
            >
              <td>{release.ocid}</td>
              <td>{release.tender?.title || "N/A"}</td>
              <td>{release.buyer?.name || "N/A"}</td>
              <td>
                {release.awards?.[0]?.value?.amount
                  ? `$${release.awards[0].value.amount.toLocaleString()}`
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL Bootstrap */}
      {selectedRelease && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedRelease.tender?.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRelease(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Organisation :</strong> {selectedRelease.buyer?.name}
                </p>
                <p>
                  <strong>OCID :</strong> {selectedRelease.ocid}
                </p>
                <p>
                  <strong>Montant :</strong>{" "}
                  {selectedRelease.awards?.[0]?.value?.amount?.toLocaleString() ||
                    "N/A"}{" "}
                  $
                </p>
                <p>
                  <strong>Méthode :</strong>{" "}
                  {selectedRelease.procurementMethodDetails}
                </p>
                <p>
                  <strong>Statut :</strong> {selectedRelease.tender?.status}
                </p>
                <p>
                  <strong>Date :</strong>{" "}
                  {new Date(selectedRelease.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Documents :</strong>
                  {selectedRelease.tender?.documents?.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-2"
                    >
                      [Lien {index + 1}]
                    </a>
                  ))}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedRelease(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEAO;
