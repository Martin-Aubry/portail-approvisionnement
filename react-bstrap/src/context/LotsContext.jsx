import React, { createContext, useState, useEffect } from "react";

export const LotsContext = createContext();

export const LotsProvider = ({ demandeId, children }) => {
  const [lots, setLots] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!demandeId) return;

    const fetchLots = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/demandes/${demandeId}/bordereaux`
        );
        const data = await res.json();
        setLots(data);
      } catch (err) {
        console.error("Erreur chargement lots:", err);
      }
    };

    fetchLots();
  }, [demandeId, API_URL]);

  return (
    <LotsContext.Provider value={{ lots, setLots }}>
      {children}
    </LotsContext.Provider>
  );
};

export default LotsContext;
