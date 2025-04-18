import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Topbar = ({
  userRole,
  setUserRole,
  utilisateur,
  setUtilisateur,
  selectedRoleId,
  setSelectedRoleId,
  setSidebarLoading,
}) => {
  const [userRoles, setUserRoles] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (utilisateur) {
      fetch(`${API_URL}/api/utilisateurs/${utilisateur.id}/roles`)
        .then((res) => res.json())
        .then((data) => {
          setUserRoles(data);

          const rolePrioritaire = data.reduce((acc, curr) =>
            curr.priorite < acc.priorite ? curr : acc
          );

          setUserRole(rolePrioritaire.role_nom);
          setSelectedRoleId(rolePrioritaire.id);
        })
        .catch((err) => console.error("Erreur fetch rôles:", err));
    } else {
      setUserRoles([]);
      setUserRole("");
    }
  }, [utilisateur, API_URL]);

  const [notifications] = useState([
    { id: 1, message: "Une nouvelle demande a été créée" },
    { id: 2, message: "La demande #42 a été soumise" },
  ]);

  return (
    <nav className="navbar navbar-expand navbar-light px-4 justify-content-between border-bottom">
      <div className="d-flex align-items-center">
        <img
          src="/logo.png"
          alt="Logo entreprise"
          className="me-3"
          style={{ maxHeight: "70px", width: "auto" }}
        />
        <span className="navbar-brand mb-1 h1">Portail approvisionnement</span>
      </div>
      <div className="d-flex align-items-center mt-2">
        <h5>Rôle : {userRole}</h5>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="dropdown" style={{ position: "relative" }}>
          <i
            className="bi bi-bell fs-5 dropdown-toggle"
            id="notificationDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ cursor: "pointer", position: "relative" }}
          ></i>
          {notifications.length > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.6rem" }}
            >
              {notifications.length}
            </span>
          )}
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="notificationDropdown"
            style={{ width: "300px" }}
          >
            {notifications.map((notif) => (
              <li key={notif.id} className="dropdown-item small text-wrap">
                🔔 {notif.message}
              </li>
            ))}
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <span className="dropdown-item text-muted text-center">
                Voir toutes les notifications
              </span>
            </li>
          </ul>
        </div>

        <div>{utilisateur?.nom}</div>
        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-fill-gear fs-4"></i>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="roleDropdown"
          >
            {userRoles.map((role) => (
              <li key={role.id}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setSidebarLoading(true);
                    setUserRole(role.role_nom);
                    setSelectedRoleId(role.id);
                    setTimeout(() => setSidebarLoading(false), 200);
                  }}
                >
                  {role.role_nom}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Link
            to="/"
            className="nav-link text-black d-flex align-items-center"
            onClick={() => setUtilisateur(null)}
            title="Se déconnecter"
          >
            <i className="bi bi-x-circle-fill fs-5"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
