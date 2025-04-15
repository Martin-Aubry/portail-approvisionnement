import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// POST /api/organisations
router.post("/", async (req, res) => {
  try {
    const data = await prisma.organisation.create({
      data: req.body,
    });
    res.json(data);
  } catch (error) {
    console.error("❌ Erreur création organisation:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /api/organisations
router.get("/", async (req, res) => {
  try {
    const organisations = await prisma.organisation.findMany();
    res.json(organisations);
  } catch (error) {
    console.error("❌ Erreur récupération organisations:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
