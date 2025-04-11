// scripts/ajouterAccesDeBase.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function ajouterAccesDeBase() {
  const initialAccess = {
    Requérant: ["Accueil", "Param", "mesdemandes"],
    "Agent - exp. client": ["Accueil", "mesdemandes"],
    "Chef de section acquisition": ["Accueil", "Dashboard"],
    "Agent - acquisition": ["Accueil", "Dashboard"],
    "Préposé à la gestion de contrat": [
      "Accueil",
      "Users",
      "Param",
      "Stats",
      "mesdemandes",
    ],
    Administrateur: [
      "Accueil",
      "Dashboard",
      "Users",
      "Param",
      "Stats",
      "mesdemandes",
      "Config",
    ],
  };

  const roles = await prisma.roles.findMany();
  const ecrans = await prisma.ecrans.findMany();

  for (const [roleNom, ecransAssocies] of Object.entries(initialAccess)) {
    const role = roles.find((r) => r.role_nom === roleNom);
    if (!role) {
      console.warn(`⚠️ Rôle "${roleNom}" introuvable.`);
      continue;
    }

    for (const nomEcran of ecransAssocies) {
      const ecran = ecrans.find((e) => e.nom === nomEcran);
      if (!ecran) {
        console.warn(`⚠️ Écran "${nomEcran}" introuvable.`);
        continue;
      }

      await prisma.acces_role_ecran.upsert({
        where: {
          roleId_ecranId: {
            roleId: role.id,
            ecranId: ecran.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          ecranId: ecran.id,
        },
      });

      console.log(`✅ Ajouté : ${roleNom} ➜ ${nomEcran}`);
    }
  }

  console.log("\n✅ Accès initiaux ajoutés avec succès.");
  await prisma.$disconnect();
}

ajouterAccesDeBase().catch((err) => {
  console.error("❌ Erreur :", err);
  prisma.$disconnect();
});
