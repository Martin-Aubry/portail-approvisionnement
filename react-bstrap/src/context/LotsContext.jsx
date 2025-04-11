import React, { createContext, useState, useEffect } from "react";

export const LotsContext = createContext();

export const LotsProvider = ({ demandeId, children }) => {
  const [lots, setLots] = useState([]);

  useEffect(() => {
    if (!demandeId) return;

    fetch(`http://localhost:3001/api/demandes/${demandeId}/bordereaux`)
      .then((res) => res.json())
      .then((data) => setLots(data))
      .catch((err) => console.error("Erreur chargement lots:", err));
  }, [demandeId]);

  return (
    <LotsContext.Provider value={{ lots, setLots }}>
      {children}
    </LotsContext.Provider>
  );
};

export default LotsContext;
