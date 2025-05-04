// Import  des models
const User = require("./User");
const Event = require("./Event");
const Profile = require("./Profile");
const QRCode = require("./QRCode");
const EventTicket = require("./EventTicket");
const Car = require("./Car");
const CarPerformance = require("./CarPerformance");
const CarPhoto = require("./CarPhoto");

// Définition des relations entre les tables
User.hasMany(Event, { foreignKey: "id_user", as: "events" });
Event.belongsTo(User, { foreignKey: "id_user", as: "organizer" });

User.hasOne(Profile, { foreignKey: "id_user", as: "profile" });
Profile.belongsTo(User, { foreignKey: "id_user", as: "user" });

User.hasOne(QRCode, { foreignKey: "id_user", as: "qrcode" });
QRCode.belongsTo(User, { foreignKey: "id_user", as: "user" });

// Un utilisateur peut avoir plusieurs tickets
User.hasMany(EventTicket, { foreignKey: "id_user", as: "tickets" });
EventTicket.belongsTo(User, { foreignKey: "id_user", as: "user" });

// Un événement peut avoir plusieurs tickets
Event.hasMany(EventTicket, { foreignKey: "id_event", as: "tickets" });
EventTicket.belongsTo(Event, { foreignKey: "id_event", as: "event" });

User.hasMany(Car, { foreignKey: "id_user", as: "cars" });
Car.belongsTo(User, { foreignKey: "id_user", as: "user" });

// Relation 1:1 entre Car et CarPerformance
Car.hasOne(CarPerformance, { foreignKey: "id_car", as: "performance" });
CarPerformance.belongsTo(Car, { foreignKey: "id_car", as: "car" });

// Relation 1:N entre Car et CarPhoto
Car.hasMany(CarPhoto, { foreignKey: "id_car", as: "photos" });
CarPhoto.belongsTo(Car, { foreignKey: "id_car", as: "car" });

module.exports = {
  User,
  Event,
  Profile,
  QRCode,
  EventTicket,
  Car,
  CarPerformance,
  CarPhoto,
};
