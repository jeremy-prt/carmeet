const { User } = require("../models");
const bcrypt = require("bcrypt");

async function seedUsers() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await User.bulkCreate(
    [
      {
        first_name: "Jérémy",
        last_name: "Durand",
        email: "jeremy1@gmail.com",
        password: hashedPassword,
        role: "organizer",
      },
      {
        first_name: "Jérémy",
        last_name: "Morel",
        email: "jeremy2@gmail.com",
        password: hashedPassword,
        role: "user",
      },
    ],
    { returning: true }
  );

  console.log("Utilisateurs insérés avec succès.");
  return users;
}

module.exports = seedUsers;
