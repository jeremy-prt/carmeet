const express = require("express");
const router = express.Router();

// Route de base
router.get("/", function (req, res) {
  res.send("Bienvenue sur l'API de carmeet");
});

module.exports = router;
