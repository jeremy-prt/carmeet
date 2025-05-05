const express = require("express");
const app = express();
const cors = require("cors");

// CORS : autoriser localhost et IP publique du VPS
const allowedOrigins = ["http://localhost:3000", "http://212.227.250.24:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les outils comme curl/postman (origin === undefined)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Importation des routes
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const eventRouter = require("./routes/event");
const profileRouter = require("./routes/profile");
const qrcodeRouter = require("./routes/qrcode");
const ticketRouter = require("./routes/ticket");
const carRouter = require("./routes/car");
const carPerformanceRouter = require("./routes/carPerformance");
const carPhotoRouter = require("./routes/carPhoto");
const autocompleteRouter = require("./routes/autocomplete");

// Utilisation des routes avec le préfixe /api
app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/event", eventRouter);
app.use("/api/profile", profileRouter);
app.use("/api/qrcode", qrcodeRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/car", carRouter);
app.use("/api/car-performance", carPerformanceRouter);
app.use("/api/car-photo", carPhotoRouter);
app.use("/api/autocomplete", autocompleteRouter);

module.exports = app;
