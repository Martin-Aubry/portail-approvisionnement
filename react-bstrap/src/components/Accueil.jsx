import React from "react";

const Accueil = () => {
  return (
    <div className="container mt-3">
      <div className="text-center mb-4">
        <h4 className="display-7 fw-bold text-primary">
          Bienvenue dans votre portail d’approvisionnement
        </h4>
        <p className="lead mt-3">
          Une solution intégrée et performante pour centraliser, planifier et
          optimiser vos demandes d’approvisionnement.
        </p>
      </div>

      <div className="row">
        {/* Section principale à gauche */}
        <div className="container-fluid">
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <i className="bi bi-stack fs-1 text-primary"></i>
                  <h5 className="card-title mt-3">Centralisation</h5>
                  <p className="card-text">
                    Une seule application pour soumettre, suivre et gérer toutes
                    vos demandes de sollicitation de marché.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <i className="bi bi-calendar-check fs-1 text-success"></i>
                  <h5 className="card-title mt-3">Planification</h5>
                  <p className="card-text">
                    Anticipez les besoins pour les unités et le Service de
                    l’approvisionnement.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <i className="bi bi-people fs-1 text-warning"></i>
                  <h5 className="card-title mt-3">Impact citoyen</h5>
                  <p className="card-text">
                    Grâce à la veille stratégique et aux regroupements, nous
                    maximisons les fonds publics.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm text-center">
                <div className="card-body">
                  <i className="bi bi-shield-check fs-1 text-info"></i>
                  <h5 className="card-title mt-3">Intelligence juridique</h5>
                  <p className="card-text">
                    Un soutien juridique automatisé et intelligent pour
                    sécuriser les processus d’appels d’offres.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <p className="text-muted fst-italic">
          Un portail pensé pour les requérants, les acheteurs, les gestionnaires
          et les citoyens.
        </p>
      </div>
    </div>
  );
};

export default Accueil;
