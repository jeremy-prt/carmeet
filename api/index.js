// index.js (ou server.js)
require("dotenv").config();
const app = require("./app");
const port = process.env.PORT || 3000;
const sequelize = require("./config/database");
require("./models/Index");

// Vérifiez la connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Lancement du serveur
const startServer = () => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
  });
};

// Synchronisation si demandé
if (process.env.SYNC_DB === "true") {
  sequelize
    .sync({ alter: true })
    .then(() => {
      console.log("Database synced");
      startServer();
    })
    .catch((err) => {
      console.error("Error syncing database:", err);
    });
} else {
  startServer();
}
