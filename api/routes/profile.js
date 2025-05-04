const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const verifyToken = require("../middlewares/verifyToken");

// Route pour créer un profil
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { profile_picture, profile_banner, description } = req.body;
    // On récupère l'id de l'utilisateur connecté depuis le token
    const id_user = req.user.id;

    // Vérifier si un profil existe déjà pour cet utilisateur
    const existingProfile = await Profile.findOne({ where: { id_user } });
    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "Un profil existe déjà pour cet utilisateur." });
    }

    // Création du profil
    const newProfile = await Profile.create({
      id_user,
      profile_picture,
      profile_banner,
      description,
    });

    return res.status(201).json({
      message: "Profil créé avec succès.",
      profile: newProfile,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la création du profil." });
  }
});

// Route pour afficher un profil en particulier par son id_profile
router.get("/:id_profile", async (req, res) => {
  try {
    const { id_profile } = req.params;
    const profile = await Profile.findByPk(id_profile);
    if (!profile) {
      return res.status(404).json({ message: "Profil introuvable." });
    }
    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération du profil." });
  }
});

module.exports = router;
