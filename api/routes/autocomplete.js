const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/address", async (req, res) => {
  const { input } = req.query;

  if (!input) {
    return res.status(400).json({ error: "Paramètre 'input' requis." });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Clé API Google Maps manquante." });
  }

  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json"
    );
    url.searchParams.append("input", input);
    url.searchParams.append("key", process.env.GOOGLE_API_KEY);
    url.searchParams.append("language", "fr");
    url.searchParams.append("types", "geocode");
    url.searchParams.append("components", "country:fr");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data.predictions);
  } catch (error) {
    console.error("Erreur avec l'API Google Maps :", error.message);
    res.status(500).json({ error: "Erreur avec l'API Google Maps" });
  }
});

router.get("/geocode", async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Paramètre 'address' requis." });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ error: "Clé API Google manquante." });
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.append("address", address);
    url.searchParams.append("key", process.env.GOOGLE_API_KEY);
    url.searchParams.append("language", "fr");

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "Aucun résultat trouvé." });
    }

    const location = data.results[0].geometry.location;
    res.json(location); // { lat: ..., lng: ... }
  } catch (error) {
    console.error("Erreur lors du géocodage :", error.message);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;
