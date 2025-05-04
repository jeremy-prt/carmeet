const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const CarPerformance = require("../models/CarPerformance");
const verifyToken = require("../middlewares/verifyToken");

// Route pour créer une fiche de performance pour une voiture
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { id_car, horsepower, max_speed, acceleration, torque, weight } =
      req.body;

    // Vérifier que toutes les informations nécessaires sont fournies
    if (
      !id_car ||
      horsepower === undefined ||
      max_speed === undefined ||
      acceleration === undefined ||
      torque === undefined ||
      weight === undefined
    ) {
      return res
        .status(400)
        .json({
          message: "Veuillez fournir toutes les informations nécessaires.",
        });
    }

    // Vérifier que la voiture existe
    const car = await Car.findByPk(id_car);
    if (!car) {
      return res.status(404).json({ message: "Voiture introuvable." });
    }

    // Vérifier que la voiture appartient à l'utilisateur connecté
    if (car.id_user !== req.user.id) {
      return res
        .status(403)
        .json({
          message: "Accès refusé: cette voiture ne vous appartient pas.",
        });
    }

    // Vérifier qu'une fiche de performance n'existe pas déjà pour cette voiture
    const existingPerformance = await CarPerformance.findOne({
      where: { id_car },
    });
    if (existingPerformance) {
      return res
        .status(400)
        .json({
          message: "Une fiche de performance existe déjà pour cette voiture.",
        });
    }

    // Création de la fiche de performance
    const performance = await CarPerformance.create({
      id_car,
      horsepower,
      max_speed,
      acceleration,
      torque,
      weight,
    });

    return res
      .status(201)
      .json({
        message: "Fiche de performance créée avec succès.",
        performance,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message:
          "Erreur serveur lors de la création de la fiche de performance.",
      });
  }
});

module.exports = router;
