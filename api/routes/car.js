const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const verifyToken = require("../middlewares/verifyToken");

// Route pour créer une voiture
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { brand, model, year, mileage, transmission, fuel_type } = req.body;
    const id_user = req.user.id; // Récupération de l'ID utilisateur depuis le token

    // Création de la voiture
    const newCar = await Car.create({
      id_user,
      brand,
      model,
      year,
      mileage,
      transmission,
      fuel_type,
    });

    return res.status(201).json({
      message: "Voiture créée avec succès.",
      car: newCar,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la création de la voiture." });
  }
});

// Route pour afficher une voiture particulière avec ses performances et photos associées
router.get("/:id_car", async (req, res) => {
  try {
    const { id_car } = req.params;

    // Recherche de la voiture en incluant les associations "performance" et "photos"
    const car = await Car.findOne({
      where: { id_car },
      include: [{ association: "performance" }, { association: "photos" }],
    });

    if (!car) {
      return res.status(404).json({ message: "Voiture introuvable." });
    }

    return res.status(200).json(car);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération de la voiture.",
    });
  }
});

module.exports = router;

module.exports = router;
