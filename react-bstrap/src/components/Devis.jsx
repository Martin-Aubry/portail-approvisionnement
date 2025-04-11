import React from "react";

const sections = {
  "A.00 INTERPRÉTATION": [
    "A.01 Terminologie [C-0.00]",
    "A.01.01 Chargé de Projet",
    "A.01.02 Devis",
    "A.01.01 Documents Techniques",
    "A.01.02 Ordre de Changement",
    "A.01.03 PRESTATAIRE DE SERVICES",
    "A.01.04 [À compléter]",
    "A.02 Primauté [C-0.00]",
    "A.02.01 Inopposabilité",
    "A.02.02 Conflits au sein de Documents Techniques",
    "A.03 Unités de mesure",
  ],
  "B.00 DESCRIPTION GÉNÉRALE": [
    "B.01 Objectif",
    "B.02 Mise en contexte",
    "B.03 Service(s) requis",
  ],
  "C.00 VALEUR ESTIMÉE DU CONTRAT": [],
  "D.00 EXIGENCES QUANT AU PRESTATAIRE DE SERVICES": [
    "D.01 Expérience",
    "D.02 Permis et autorisations [F-7.00 et C-7.00]",
    "D.03 Certifications et accréditations [F-7.00 et C-7.00]",
    "D.04 Ressources humaines",
    "D.04.01 Personnel",
    "D.04.02 Sous-traitants",
    "D.05 Ressources matérielles",
    "D.06 Proximité",
  ],
  "E.00 EXIGENCES QUANT AU(X) SERVICE(S)": [
    "E.01 Méthode ou procédé",
    "E.02 Santé et sécurité",
    "E.03 Normes et règlementations",
    "E.04 Substitution ou équivalence [R-1.00]",
    "E.05 Séance de démonstration pratique [R-1.00]",
  ],
  "F.00 EXIGENCES SE RAPPORTANT AU SITE [R-1.00]": [
    "F.01 Plan du site",
    "F.02 Données techniques sur le site",
    "F.02.01 Aménagement physique",
    "F.02.02 Caractéristiques",
    "F.03 Contraintes particulières",
  ],
  "G.00 EXIGENCES QUANT AUX LIVRABLES": [
    "G.01 Rencontre technique",
    "G.02 Description",
    "G.03 Rapport final et présentation des résultats",
    "G.03.01 Contenu",
    "G.03.02 Présentation",
    "G.04 Échéancier [C-10.00]",
    "G.05 Acceptation",
    "G.05.01 Avec réserve",
    "G.05.02 Sans réserve",
  ],
  "H.00 EXIGENCES QUANT À LA DOCUMENTATION": [
    "H.01 À remettre avec la soumission [F -7.00]",
    "H.01.01 Références",
    "H.01.02 Permis et autorisations",
    "H.01.03 Certifications et accréditations de l’entreprise",
    "H.01.04 Formation",
  ],
  "I.00 EXIGENCES QUANT À LA FORMATION": [],
  "J.00 EXIGENCES ENVIRONNEMENTALES": [],
  "K.00 RENSEIGNEMENTS ADDITIONNELS [R-6.00]": [
    "K.01 Rapports et études",
    "K.02 Autres informations",
  ],
};

export default function Devis() {
  return (
    <div className="container-fluid mt-4">
      <h3 className="mb-4">Devis technique</h3>
      <div className="accordion" id="accordionDevis">
        {Object.entries(sections).map(([sectionTitle, items], index) => {
          const collapseId = `collapse${index}`;
          const headingId = `heading${index}`;
          return (
            <div className="accordion-item" key={sectionTitle}>
              <h2 className="accordion-header" id={headingId}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${collapseId}`}
                  aria-expanded="false"
                  aria-controls={collapseId}
                >
                  {sectionTitle}
                </button>
              </h2>
              <div
                id={collapseId}
                className="accordion-collapse collapse"
                aria-labelledby={headingId}
                data-bs-parent="#accordionDevis"
              >
                <div className="accordion-body">
                  {items.length > 0 ? (
                    <ul className="list-unstyled ms-3">
                      {items.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucune sous-section spécifiée pour cette section.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
