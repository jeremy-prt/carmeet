const seedUsers = require("./seed-users");
const seedEvents = require("./seed-events");

async function seedAll() {
  try {
    const users = await seedUsers();
    await seedEvents(users);
    console.log("Données de test insérées avec succès.");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors de l’insertion des données :", err);
    process.exit(1);
  }
}

seedAll();
