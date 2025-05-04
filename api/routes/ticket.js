const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const EventTicket = require("../models/EventTicket");
const verifyToken = require("../middlewares/verifyToken");

// Route pour acheter (créer) un ticket pour un événement
router.post("/buy", verifyToken, async (req, res) => {
  try {
    const { id_event } = req.body; // L'ID de l'événement doit être fourni dans le corps de la requête
    const id_user = req.user.id; // Récupération de l'ID de l'utilisateur depuis le token

    // Vérifier que l'événement existe
    const event = await Event.findByPk(id_event);
    if (!event) {
      return res.status(404).json({ message: "Événement introuvable." });
    }

    // Vérifier combien de tickets ont déjà été achetés pour cet événement
    const soldTickets = await EventTicket.count({ where: { id_event } });
    if (soldTickets >= event.available_seats) {
      return res
        .status(400)
        .json({ message: "Plus de places disponibles pour cet événement." });
    }

    // Créer le ticket
    const ticket = await EventTicket.create({
      id_event,
      id_user,
      status: "confirmed",
    });

    return res.status(201).json({
      message: "Ticket acheté avec succès.",
      ticket,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de l'achat du ticket." });
  }
});

// Route pour afficher un ticket spécifique
// L'utilisateur connecté ne peut consulter que ses propres tickets
router.get("/:id_ticket", verifyToken, async (req, res) => {
  try {
    const { id_ticket } = req.params;
    const id_user = req.user.id;

    // Recherche du ticket en s'assurant qu'il appartient à l'utilisateur connecté
    const ticket = await EventTicket.findOne({ where: { id_ticket, id_user } });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket introuvable." });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération du ticket." });
  }
});

module.exports = router;
