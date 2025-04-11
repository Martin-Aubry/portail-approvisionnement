import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";

const Sidebar = ({
  isCollapsed,
  toggleSidebar,
  utilisateur,
  selectedRoleId,
}) => {
  const [ecransAccessibles, setEcransAccessibles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerEcransPourRole = async () => {
      if (!selectedRoleId) return;

      try {
        const res = await fetch(
          `http://localhost:3001/api/roles/${selectedRoleId}/acces`
        );
        const acces = await res.json();

        const nomsEcrans = acces.map((a) => a.ecran?.nom).filter((nom) => nom); // enlever undefined au cas où

        setEcransAccessibles(nomsEcrans);
      } catch (error) {
        console.error("Erreur chargement écrans accessibles :", error);
      } finally {
        setLoading(false); // ✅ Toujours désactiver le loading
      }
    };

    chargerEcransPourRole();
  }, [selectedRoleId]);

  const menus = ecransAccessibles;

  if (loading) {
    return <Spinner message="Chargement..." />;
  }

  return (
    <div
      className="text-black p-3 sidebar-transition d-flex flex-column border-end"
      style={{
        width: isCollapsed ? "93px" : "220px",
        minHeight: "94vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div className="p-1 overflow-auto" style={{ flexGrow: 1 }}>
        <ul className="nav flex-column">
          {menus.includes("Accueil") && (
            <li className="nav-item mb-2">
              <Link
                to="/"
                className="nav-link text-black d-flex align-items-center"
              >
                <i className="bi bi-house me-2"></i>
                <span className={isCollapsed ? "d-none" : ""}>Accueil</span>
              </Link>
            </li>
          )}

          {menus.includes("mesdemandes") && (
            <li className="nav-item mb-2">
              <Link
                to="/mesdemandes"
                className="nav-link text-black d-flex align-items-center"
              >
                <i className="bi bi-card-checklist me-2"></i>
                <span className={isCollapsed ? "d-none" : ""}>
                  Mes demandes
                </span>
              </Link>
            </li>
          )}
          {menus.includes("GestionAO") && (
            <li className="nav-item mb-2">
              <Link
                to="/gestionAO"
                className="nav-link text-black d-flex align-items-center"
              >
                <i className="bi bi-file-earmark-richtext me-2"></i>
                <span className={isCollapsed ? "d-none" : ""}>
                  Gestion des AO
                </span>
              </Link>
            </li>
          )}
          {menus.includes("AffectationDemandes") && (
            <li className="nav-item mb-2">
              <Link
                to="/AffectationDemandes"
                className="nav-link text-black d-flex align-items-center"
              >
                <i className="bi bi-share me-2"></i>
                <span className={isCollapsed ? "d-none" : ""}>Affectation</span>
              </Link>
            </li>
          )}
          {menus.includes("Dashboard") && (
            <li className="nav-item mb-2">
              <Link
                to="/dashboard"
                className="nav-link text-black d-flex align-items-center"
              >
                <i className="bi bi-speedometer2 me-2"></i>
                <span className={isCollapsed ? "d-none" : ""}>
                  Tableau de bord
                </span>
              </Link>
            </li>
          )}
          {menus.includes("Users") && (
            <li className="nav-item mb-2">
              <Link
                to="/users"
                className="nav-link text-black d-flex align-items-center"
              >
                <i className="bi bi-people me-2"></i>
                <span className={isCollapsed ? "d-none" : ""}>
                  Utilisateurs
                </span>
              </Link>
            </li>
          )}
          {menus.includes("Stats") && (
            <li className="nav-item mb-2">
              <Link
                to="/stats"
                className="nav-link text-black d-flex align-items-center"
              >
                <i className="bi bi-bar-chart-line me-2"></i>
                <span className={isCollapsed ? "d-none" : ""}>
                  Statistiques
                </span>
              </Link>
            </li>
          )}
          {menus.includes("Param") && (
            <li className="nav-item mb-2">
              <Link
                to="/param"
                className="nav-link text-black d-flex align-items-center"
              >
                <i className="bi bi-gear me-2"></i>
                <span className={isCollapsed ? "d-none" : ""}>Paramètres</span>
              </Link>
            </li>
          )}
          {menus.includes("Config") && (
            <li className="nav-item mb-2">
              <Link
                to="/config"
                className="nav-link text-black d-flex align-items-center"
              >
                <i className="bi bi-gear-wide-connected me-2"></i>
                <span className={isCollapsed ? "d-none" : ""}>
                  Configuration
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className="p-1 border-top overflow-auto">
        <ul className="nav flex-column">
          <a
            className="nav-link text-black d-flex align-items-center"
            href="#"
            onClick={toggleSidebar}
            title={isCollapsed ? "Vue complète" : "Vue minimale"}
          >
            <i
              className={`bi ${
                isCollapsed ? "bi-arrow-bar-right" : "bi-arrow-bar-left"
              } me-2`}
            ></i>
            <span className={isCollapsed ? "d-none" : ""}>
              {isCollapsed ? "Vue complète" : "Vue minimale"}
            </span>
          </a>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
