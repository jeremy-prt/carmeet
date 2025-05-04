const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const CarPhoto = require("../models/CarPhoto.js");
const verifyToken = require("../middlewares/verifyToken");

// Route pour créer une photo de voiture
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { id_car, photo_type, photo_link } = req.body;

    // Vérifier que les informations nécessaires sont fournies
    if (!id_car || !photo_type || !photo_link) {
      return res.status(400).json({
        message:
          "Veuillez fournir l'id_car, le type de photo et le lien de la photo.",
      });
    }

    // Vérifier que la voiture existe
    const car = await Car.findByPk(id_car);
    if (!car) {
      return res.status(404).json({ message: "Voiture introuvable." });
    }

    // Vérifier que la voiture appartient à l'utilisateur connecté
    if (car.id_user !== req.user.id) {
      return res.status(403).json({
        message: "Accès refusé: cette voiture ne vous appartient pas.",
      });
    }

    // Création de la photo de voiture
    const carPhoto = await CarPhoto.create({
      id_car,
      photo_type,
      photo_link,
    });

    return res
      .status(201)
      .json({ message: "Photo de voiture créée avec succès.", carPhoto });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création de la photo de voiture.",
    });
  }
});

module.exports = router;
