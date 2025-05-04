const express = require("express");
const router = express.Router();
const QRCode = require("../models/QRCode");
const verifyToken = require("../middlewares/verifyToken");

// Route pour créer un QR code
router.post("/create", verifyToken, async (req, res) => {
  try {
    const id_user = req.user.id;
    const { qrcode_data, size, color, bgcolor, ecc, margin } = req.body;

    // Vérification que tous les champs sont présents
    const missingFields = [];
    if (!qrcode_data) missingFields.push("qrcode_data");
    if (!size) missingFields.push("size");
    if (!color) missingFields.push("color");
    if (!bgcolor) missingFields.push("bgcolor");
    if (!ecc) missingFields.push("ecc");
    if (!margin) missingFields.push("margin");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Les champs suivants sont manquants ou vides : ${missingFields.join(
          ", "
        )}.`,
      });
    }

    // Vérifier si un QR code existe déjà pour cet utilisateur
    const existingQRCode = await QRCode.findOne({ where: { id_user } });
    if (existingQRCode) {
      return res.status(400).json({
        message: "Un QR code a déjà été généré pour cet utilisateur.",
      });
    }

    // Générer l’URL du QR code
    const encodedData = encodeURIComponent(qrcode_data);
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedData}&size=${size}&color=${color}&bgcolor=${bgcolor}&ecc=${ecc}&margin=${margin}`;

    // Création en base avec l'URL du QR code
    const newQRCode = await QRCode.create({
      id_user,
      qrcode_data,
      qrcode_image_url: qrImageUrl,
    });

    return res.status(201).json({
      message: "QR code créé avec succès.",
      qrcode: newQRCode,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur lors de la création du QR code.",
    });
  }
});

// Route pour afficher le QR code de l'utilisateur connecté
router.get("/my", verifyToken, async (req, res) => {
  try {
    const id_user = req.user.id;
    const qrcode = await QRCode.findOne({ where: { id_user } });
    if (!qrcode) {
      return res
        .status(404)
        .json({ message: "Aucun QR code trouvé pour cet utilisateur." });
    }
    return res.status(200).json(qrcode);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération du QR code.",
    });
  }
});

// Route pour supprimer le QR code de l'utilisateur connecté
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const id_user = req.user.id;

    const qrcode = await QRCode.findOne({ where: { id_user } });

    if (!qrcode) {
      return res
        .status(404)
        .json({ message: "Aucun QR code à supprimer pour cet utilisateur." });
    }

    await qrcode.destroy();

    return res.status(200).json({ message: "QR code supprimé avec succès." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur lors de la suppression du QR code.",
    });
  }
});

module.exports = router;
