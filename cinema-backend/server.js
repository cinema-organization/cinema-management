// server.js
const cors=require("cors");
const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");
const cron = require("node-cron");
const moment = require("moment");
const Seance = require("./models/seanceModel");

// Middlewares
app.use(express.json());

app.use(cors());

// Connexion DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/films", require("./routes/filmRoutes"));
app.use("/api/salles", require("./routes/salleRoutes"));
app.use("/api/seances", require("./routes/seanceRoutes"));
app.use("/api/reservations", require("./routes/reservationRoutes"));
app.use('/api/stats', require('./routes/statsRoutes'));

// Route de test
app.get("/", (req, res) => {
  res.send("Bienvenue dans le backend du système de cinéma 🎬🎬🎬");
});
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée ❌" });
});

// 🚀 Tâche planifiée (cron job)
cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ Vérification automatique des séances...");

  try {
    const now = moment();

    // ✅ 1. Marquer comme "terminée" les séances dont l’heure est passée
    await Seance.updateMany(
      { heure: { $lt: now.toDate() }, statut: { $ne: "terminée" } },
      { $set: { statut: "terminée" } }
    );

    // ✅ 2. À minuit, marquer les séances terminées de la veille comme "n’est pas visualisé"
    if (now.hour() === 0 && now.minute() < 5) {
      await Seance.updateMany(
        { statut: "terminée" },
        { $set: { statut: "n’est pas visualisé" } }
      );
      console.log("🌙 Les séances terminées sont passées à 'n’est pas visualisé'");
    }

    console.log("✅ Vérification des séances terminée");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des statuts :", error.message);
  }
});


// Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));