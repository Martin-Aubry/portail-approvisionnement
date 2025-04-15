import "dotenv/config";
import express from "express";
import cors from "cors";
import supabaseAdmin from "./supabaseAdmin.js";
import prisma from "./lib/prisma.js";
import organisationRoutes from "./routes/organisations.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/organisations", organisationRoutes);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

app.get("/api/demandes", async (req, res) => {
  const demandes = await prisma.demande.findMany();
  res.json(demandes);
});

// GET les rôles d’un utilisateur spécifique
app.get("/api/utilisateurs/:id/roles", async (req, res) => {
  const utilisateurId = parseInt(req.params.id);

  const roles = await prisma.utilisateur_role.findMany({
    where: { utilisateurId },
    include: {
      role: true,
    },
    orderBy: {
      role: {
        priorite: "asc", // 👈 très important pour la sélection automatique
      },
    },
  });

  // On retourne une liste simple avec nom et priorité
  res.json(
    roles.map((r) => ({
      id: r.role.id,
      role_nom: r.role.role_nom,
      priorite: r.role.priorite,
    }))
  );
});

app.put("/api/utilisateurs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { nom, courriel, mot_de_passe, roles = [] } = req.body;

  try {
    const updatedUser = await prisma.utilisateurs.update({
      where: { id },
      data: { nom, courriel, mot_de_passe },
    });

    await prisma.utilisateur_role.deleteMany({ where: { utilisateurId: id } });

    if (roles.length > 0) {
      await prisma.utilisateur_role.createMany({
        data: roles.map((roleId) => ({
          utilisateurId: id,
          roleId,
        })),
      });
    }

    res.json({ message: "Utilisateur mis à jour", updatedUser });
  } catch (error) {
    console.error("Erreur mise à jour utilisateur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/roles", async (req, res) => {
  const roles = await prisma.roles.findMany();
  res.json(roles);
});

app.get("/api/utilisateurs-avec-roles", async (req, res) => {
  const utilisateurs = await prisma.utilisateurs.findMany({
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });
  res.json(utilisateurs);
});

// POST /api/utilisateurs
app.post("/api/utilisateurs", async (req, res) => {
  const { nom, courriel, mot_de_passe, roles } = req.body;

  if (!nom || !courriel || !mot_de_passe) {
    return res.status(400).json({ error: "Champs requis manquants." });
  }

  if (mot_de_passe.length < 6) {
    return res.status(400).json({
      error: "Le mot de passe doit contenir au moins 6 caractères.",
    });
  }

  try {
    // ✅ Étape 1 : vérifier si l'utilisateur existe déjà dans Supabase Auth
    const { data: usersList, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      return res.status(500).json({
        error: "Erreur lors de la récupération des utilisateurs Supabase.",
      });
    }

    const existingUser = usersList.users.find((u) => u.email === courriel);
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Utilisateur déjà existant dans Supabase." });
    }

    // ✅ Étape 2 : créer l’utilisateur dans Supabase Auth
    const { error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: courriel,
      password: mot_de_passe,
      email_confirm: true,
    });

    if (signUpError) {
      return res
        .status(500)
        .json({ error: "Erreur création Supabase: " + signUpError.message });
    }

    // ✅ Étape 3 : l’ajouter dans ta table Utilisateurs
    const nouvelUtilisateur = await prisma.utilisateurs.create({
      data: {
        nom,
        courriel,
        mot_de_passe,
        roles: {
          create: roles.map((roleId) => ({
            role: { connect: { id: roleId } },
          })),
        },
      },
      include: { roles: true },
    });

    res.status(201).json(nouvelUtilisateur);
  } catch (err) {
    console.error("❌ Erreur backend:", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

app.get("/api/utilisateurs", async (req, res) => {
  const utilisateurs = await prisma.utilisateurs.findMany();
  res.json(utilisateurs);
});

app.get("/api/demandes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const demande = await prisma.demande.findUnique({
    where: { id },
  });

  if (!demande) {
    return res.status(404).json({ error: "Demande non trouvée" });
  }

  res.json(demande);
});

app.put("/api/demandes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { titre, statut, unite } = req.body;

  const updated = await prisma.demande.update({
    where: { id },
    data: { titre, statut, unite },
  });

  res.json(updated);
});

app.post("/api/demandes", async (req, res) => {
  const { titre, statut, unite, courriel } = req.body;
  const demande = await prisma.demande.create({
    data: { titre, statut, unite, courriel },
  });
  res.json(demande);
});

// GET toutes les unités
app.get("/api/unites", async (req, res) => {
  const unites = await prisma.Unite_affaires.findMany();
  res.json(unites);
});

// POST une nouvelle unité
app.post("/api/unites", async (req, res) => {
  const { nom } = req.body;
  const nouvelleUnite = await prisma.Unite_affaires.create({ data: { nom } });
  res.json(nouvelleUnite);
});

// PUT (modifier)
app.put("/api/unites/:id", async (req, res) => {
  const { nom } = req.body;
  const { id } = req.params;
  const updated = await prisma.Unite_affaires.update({
    where: { id: parseInt(id) },
    data: { nom },
  });
  res.json(updated);
});

// DELETE
app.delete("/api/unites/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.Unite_affaires.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Supprimé avec succès" });
});

app.delete("/api/utilisateurs/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // Supprimer d'abord les rôles liés (clé étrangère)
    await prisma.utilisateur_role.deleteMany({ where: { utilisateurId: id } });

    // Supprimer l'utilisateur
    await prisma.utilisateurs.delete({ where: { id } });

    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    console.error("Erreur suppression utilisateur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupérer les écrans accessibles pour un rôle donné
app.get("/api/roles/:id/acces", async (req, res) => {
  const roleId = parseInt(req.params.id);

  try {
    const acces = await prisma.acces_role_ecran.findMany({
      where: { roleId },
      include: {
        role: true,
        ecran: true, // ✅ ajoute ceci pour inclure les infos de l'écran
      },
    });

    res.json(acces);
  } catch (error) {
    console.error("Erreur récupération accès rôle :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/acces", async (req, res) => {
  const { roleId, ecran } = req.body;

  try {
    const accesCree = await prisma.acces_role_ecran.create({
      data: { roleId, ecran },
    });

    res.status(201).json(accesCree);
  } catch (error) {
    console.error("Erreur création accès :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
app.delete("/api/acces/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.acces_role_ecran.delete({ where: { id } });
    res.json({ message: "Accès supprimé" });
  } catch (error) {
    console.error("Erreur suppression accès :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Récupère tous les écrans
app.get("/api/ecrans", async (req, res) => {
  const ecrans = await prisma.ecrans.findMany();
  res.json(ecrans);
});

// Récupère les accès aux écrans par rôle
app.get("/api/acces-role-ecran", async (req, res) => {
  const acces = await prisma.acces_role_ecran.findMany({
    include: {
      role: true,
      ecran: true,
    },
  });
  res.json(acces);
});

// Ajouter un écran
app.post("/api/ecrans", async (req, res) => {
  const { nom } = req.body;
  const ecran = await prisma.ecrans.create({ data: { nom } });
  res.json(ecran);
});

// Associer un écran à un rôle
app.post("/api/acces", async (req, res) => {
  const { roleId, ecranId } = req.body;
  const acces = await prisma.acces_role_ecran.create({
    data: { roleId, ecranId },
  });
  res.json(acces);
});

// Récupérer les écrans d’un rôle
app.get("/api/roles/:id/ecrans", async (req, res) => {
  const roleId = parseInt(req.params.id);
  const acces = await prisma.acces_role_ecran.findMany({
    where: { roleId },
    include: { ecran: true },
  });
  res.json(acces.map((a) => a.ecran.nom));
});

// POST pour créer un nouveau rôle
app.post("/api/roles", async (req, res) => {
  const { role_nom, priorite } = req.body;

  console.log("📩 Données reçues :", role_nom, priorite); // <-- Ajoute ceci

  if (!role_nom || isNaN(priorite)) {
    return res.status(400).json({ error: "Nom ou priorité invalide." });
  }

  try {
    const nouveauRole = await prisma.roles.create({
      data: {
        role_nom,
        priorite: parseInt(priorite),
      },
    });

    res.status(201).json(nouveauRole);
  } catch (error) {
    console.error("❌ Erreur création rôle :", error); // <-- Important !
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la création du rôle." });
  }
});

app.post("/api/acces-role-ecran", async (req, res) => {
  const { roleId, ecranId } = req.body;

  try {
    const acces = await prisma.acces_role_ecran.create({
      data: { roleId, ecranId },
    });

    res.status(201).json(acces);
  } catch (err) {
    console.error("Erreur ajout accès :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.delete("/api/acces-role-ecran", async (req, res) => {
  const { roleId, ecranId } = req.body;

  try {
    const acces = await prisma.acces_role_ecran.findFirst({
      where: { roleId, ecranId },
    });

    if (!acces) return res.status(404).json({ error: "Accès non trouvé" });

    await prisma.acces_role_ecran.delete({
      where: { id: acces.id },
    });

    res.json({ message: "Accès supprimé" });
  } catch (err) {
    console.error("Erreur suppression accès :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/utilisateurs/:id/ecrans", async (req, res) => {
  const utilisateurId = parseInt(req.params.id);

  try {
    const roles = await prisma.utilisateur_role.findMany({
      where: { utilisateurId },
      select: {
        roleId: true,
      },
    });

    const roleIds = roles.map((r) => r.roleId);

    const acces = await prisma.acces_role_ecran.findMany({
      where: {
        roleId: { in: roleIds },
      },
      include: {
        ecran: true,
      },
    });

    const ecransUniques = [
      ...new Map(acces.map((a) => [a.ecran.nom, a.ecran])).values(),
    ];

    res.json(ecransUniques);
  } catch (error) {
    console.error("Erreur récupération écrans utilisateur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 GET tous les lots d'une demande
app.get("/api/demandes/:demandeId/lots", async (req, res) => {
  const { demandeId } = req.params;
  try {
    const lots = await prisma.lot.findMany({
      where: { demandeId: parseInt(demandeId) },
      include: { items: true },
    });
    res.json(lots);
  } catch (error) {
    console.error("Erreur récupération des lots :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 POST un nouveau lot à une demande
app.post("/api/demandes/:demandeId/lots", async (req, res) => {
  const { demandeId } = req.params;
  const { description } = req.body;
  try {
    const lotCree = await prisma.lot.create({
      data: {
        description,
        demandeId: parseInt(demandeId),
      },
    });
    res.status(201).json(lotCree);
  } catch (error) {
    console.error("Erreur création de lot :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔹 POST un nouvel item dans un lot
app.post("/api/lots/:lotId/items", async (req, res) => {
  const { lotId } = req.params;
  const { description, quantite, unite, prixUnitaire } = req.body;
  try {
    const itemCree = await prisma.itemBordereau.create({
      data: {
        lotId: parseInt(lotId),
        description,
        quantite: parseFloat(quantite),
        unite,
        prixUnitaire: parseFloat(prixUnitaire),
      },
    });
    res.status(201).json(itemCree);
  } catch (error) {
    console.error("Erreur création item :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/demandes/:id/bordereaux", async (req, res) => {
  const demandeId = parseInt(req.params.id);
  const { lots } = req.body;

  console.log("📦 Lots reçus :", JSON.stringify(lots, null, 2));

  if (!lots || !Array.isArray(lots)) {
    return res.status(400).json({ error: "Format des lots invalide." });
  }

  try {
    // 🧹 Étape 1 : récupérer les anciens lots liés à cette demande
    const anciensLots = await prisma.lot.findMany({
      where: { demandeId },
      select: { id: true },
    });

    const anciensLotsIds = anciensLots.map((lot) => lot.id);

    // 🧹 Étape 2 : supprimer les items liés à ces lots
    await prisma.itemBordereau.deleteMany({
      where: { lotId: { in: anciensLotsIds } },
    });

    // 🧹 Étape 3 : supprimer les lots eux-mêmes
    await prisma.lot.deleteMany({
      where: { id: { in: anciensLotsIds } },
    });

    // ✅ Étape 4 : recréer les lots et leurs items
    for (const lot of lots) {
      const nouveauLot = await prisma.lot.create({
        data: {
          description: lot.description,
          demande: { connect: { id: demandeId } },
          items: {
            create: lot.items.map((item) => {
              console.log("🔍 Item en cours :", item);
              return {
                description: item.description ?? "",
                quantite: parseFloat(item.quantite) || 0,
                unite: item.unite ?? "",
                prixUnitaire: parseFloat(item.prixUnitaire) || 0,
              };
            }),
          },
        },
      });

      console.log("✅ Lot sauvegardé :", nouveauLot.id);
    }

    res.status(200).json({ message: "Bordereaux enregistrés avec succès." });
  } catch (error) {
    console.error("❌ Erreur lors de l'enregistrement des bordereaux :", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement." });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.itemBordereau.delete({
      where: { id },
    });
    res.json({ message: "Item supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression item :", error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'item." });
  }
});

app.get("/api/demandes/:id/bordereaux", async (req, res) => {
  const demandeId = parseInt(req.params.id);

  try {
    const lots = await prisma.lot.findMany({
      where: { demandeId },
      include: { items: true },
    });

    res.json(lots);
  } catch (error) {
    console.error("Erreur récupération bordereaux :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.delete("/api/lots/:id", async (req, res) => {
  const lotId = parseInt(req.params.id);

  try {
    await prisma.itemBordereau.deleteMany({
      where: { lotId },
    });

    await prisma.lot.delete({
      where: { id: lotId },
    });

    res.status(200).json({ message: "Lot supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur suppression lot :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du lot." });
  }
});

app.delete("/api/lots/:id", async (req, res) => {
  const lotId = parseInt(req.params.id);

  try {
    // Supprimer les items liés à ce lot
    await prisma.itemBordereau.deleteMany({
      where: { lotId },
    });

    // Supprimer le lot ensuite
    await prisma.lot.delete({
      where: { id: lotId },
    });

    res.status(200).json({ message: "Lot supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur suppression lot :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du lot." });
  }
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.get("/api/utilisateurs-par-courriel/:email", async (req, res) => {
  const courriel = req.params.email;

  try {
    const utilisateur = await prisma.utilisateurs.findFirst({
      where: { courriel },
      include: {
        roles: {
          include: {
            role: true,
          },
          orderBy: {
            role: {
              priorite: "asc", // Pour s'assurer que les rôles sont triés
            },
          },
        },
      },
    });

    if (!utilisateur) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // ✅ On reformate les rôles pour que le frontend puisse bien les utiliser
    const roles = utilisateur.roles.map((r) => ({
      id: r.role.id,
      role_nom: r.role.role_nom,
      priorite: r.role.priorite,
    }));

    res.json({
      id: utilisateur.id,
      nom: utilisateur.nom,
      courriel: utilisateur.courriel,
      roles,
    });
  } catch (error) {
    console.error("❌ Erreur récupération utilisateur par courriel:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(3001, () => console.log("API démarrée sur http://localhost:3001"));
