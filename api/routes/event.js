const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const verifyOrganizer = require("../middlewares/verifyOrganizer");

// Route pour créer un événement (accessible uniquement aux organisateurs)
router.post("/create", verifyOrganizer, async (req, res) => {
  try {
    const {
      name,
      event_type,
      description,
      longitude,
      latitude,
      address,
      city,
      category,
      event_date,
      event_time,
      price,
      available_seats,
    } = req.body;

    // L'identifiant de l'utilisateur (organisateur) est récupéré depuis le token
    const id_user = req.user.id;

    const newEvent = await Event.create({
      id_user,
      name,
      event_type,
      description,
      longitude,
      latitude,
      address,
      city,
      category,
      event_date,
      event_time,
      price,
      available_seats,
    });

    return res.status(201).json({
      message: "Événement créé avec succès.",
      event: newEvent,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la création de l'événement." });
  }
});

// Route pour récupérer tous les événements
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll();
    return res.status(200).json(events);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des événements." });
  }
});

// Route pour récupérer un événement précis par son ID
router.get("/:id_event", async (req, res) => {
  try {
    const { id_event } = req.params;
    const event = await Event.findByPk(id_event);

    if (!event) {
      return res.status(404).json({ message: "Événement introuvable." });
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'événement." });
  }
});

// Route pour mettre à jour un événement existant
router.put("/:id_event", verifyOrganizer, async (req, res) => {
  try {
    const { id_event } = req.params;
    // Recherche de l'événement par son id
    const event = await Event.findByPk(id_event);
    if (!event) {
      return res.status(404).json({ message: "Événement introuvable." });
    }

    // Vérifier que l'utilisateur connecté est bien le créateur de l'événement
    if (event.id_user !== req.user.id) {
      return res
        .status(403)
        .json({
          message:
            "Accès refusé. Vous n'êtes pas le propriétaire de cet événement.",
        });
    }

    // Extraction des champs mis à jour depuis le corps de la requête
    const {
      name,
      event_type,
      description,
      longitude,
      latitude,
      address,
      city,
      category,
      event_date,
      event_time,
      price,
      available_seats,
      is_featured,
    } = req.body;

    // Mise à jour de l'événement
    await event.update({
      name: name !== undefined ? name : event.name,
      event_type: event_type !== undefined ? event_type : event.event_type,
      description: description !== undefined ? description : event.description,
      longitude: longitude !== undefined ? longitude : event.longitude,
      latitude: latitude !== undefined ? latitude : event.latitude,
      address: address !== undefined ? address : event.address,
      city: city !== undefined ? city : event.city,
      category: category !== undefined ? category : event.category,
      event_date: event_date !== undefined ? event_date : event.event_date,
      event_time: event_time !== undefined ? event_time : event.event_time,
      price: price !== undefined ? price : event.price,
      available_seats:
        available_seats !== undefined ? available_seats : event.available_seats,
      is_featured: is_featured !== undefined ? is_featured : event.is_featured,
    });

    return res
      .status(200)
      .json({ message: "Événement mis à jour avec succès.", event });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: "Erreur serveur lors de la mise à jour de l'événement.",
      });
  }
});

module.exports = router;
