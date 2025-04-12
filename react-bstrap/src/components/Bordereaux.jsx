// ...imports identiques
export default function Bordereaux() {
  const { id } = useParams();
  const [descriptionLot, setDescriptionLot] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [cibleSuppression, setCibleSuppression] = useState(null);
  const { lots, setLots } = useContext(LotsContext);
  const API_URL = import.meta.env.VITE_API_URL; // ✅ À AJOUTER ICI

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
          await fetch(`${API_URL}/api/items/${itemId}`, {
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
          await fetch(`${API_URL}/api/lots/${lotId}`, {
            method: "DELETE",
          });
        }

        updatedLots.splice(lotIndex, 1);
        setLots(updatedLots);
      }

      annulerSuppression();
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
      description: "",
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
          description: item.description,
          quantite: parseFloat(item.quantite),
          unite: item.unite,
          prixUnitaire: parseFloat(item.prixUnitaire),
        })),
      }));

      console.log("📦 Lots à sauvegarder :", lotsFormates);

      const response = await fetch(`${API_URL}/api/demandes/${id}/bordereaux`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lots: lotsFormates }),
      });

      const result = await response.json();
      console.log("✅ Bordereaux sauvegardés :", result);
      alert("Bordereaux sauvegardés avec succès !");
    } catch (error) {
      console.error("❌ Erreur de sauvegarde :", error);
      alert("Une erreur est survenue.");
    }
  };

  // ...JSX identique
}
