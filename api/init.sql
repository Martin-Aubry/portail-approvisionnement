-- CreateTable
CREATE TABLE "Categories_magasinage" (
    "id" SERIAL NOT NULL,
    "categories_magasinage" TEXT,

    CONSTRAINT "Categories_magasinage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demande" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "courriel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Demande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acces_role_ecran" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "ecranId" INTEGER NOT NULL,

    CONSTRAINT "Acces_role_ecran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type_traitement_souhaite" (
    "id" SERIAL NOT NULL,
    "type_traitement_souhaite" INTEGER,

    CONSTRAINT "Type_traitement_souhaite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unite_affaires" (
    "id" SERIAL NOT NULL,
    "nom" TEXT,

    CONSTRAINT "Unite_affaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom" TEXT,
    "courriel" TEXT,
    "mot_de_passe" TEXT,

    CONSTRAINT "Utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "role_nom" TEXT NOT NULL,
    "priorite" INTEGER NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateur_role" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "Utilisateur_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ecrans" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Ecrans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lots" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "demandeId" INTEGER NOT NULL,

    CONSTRAINT "Lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item_Bordereau" (
    "id" SERIAL NOT NULL,
    "lotId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "unite" TEXT NOT NULL,
    "prixUnitaire" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Item_Bordereau_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Acces_role_ecran_roleId_ecranId_key" ON "Acces_role_ecran"("roleId", "ecranId");

-- CreateIndex
CREATE UNIQUE INDEX "Ecrans_nom_key" ON "Ecrans"("nom");

-- AddForeignKey
ALTER TABLE "Acces_role_ecran" ADD CONSTRAINT "Acces_role_ecran_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acces_role_ecran" ADD CONSTRAINT "Acces_role_ecran_ecranId_fkey" FOREIGN KEY ("ecranId") REFERENCES "Ecrans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Utilisateur_role" ADD CONSTRAINT "Utilisateur_role_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Utilisateur_role" ADD CONSTRAINT "Utilisateur_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lots" ADD CONSTRAINT "Lots_demandeId_fkey" FOREIGN KEY ("demandeId") REFERENCES "Demande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Bordereau" ADD CONSTRAINT "Item_Bordereau_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

