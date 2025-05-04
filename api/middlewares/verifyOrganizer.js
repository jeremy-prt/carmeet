const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyOrganizer = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Accès refusé. Pas de token fourni." });
  }

  // Le token doit être au format "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Token non valide." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Vérifie que le rôle est "organisateur"
    if (decoded.role !== "organizer") {
      return res.status(403).json({
        message: "Accès refusé. Vous n'avez pas les droits nécessaires.",
      });
    }
    req.user = decoded; // Ajoute les infos de l'utilisateur à la requête
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Token invalide." });
  }
};

module.exports = verifyOrganizer;
