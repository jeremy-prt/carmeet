const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EventTicket = sequelize.define(
  "EventTicket",
  {
    id_ticket: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_event: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("confirmed", "refunded"),
      allowNull: false,
      defaultValue: "confirmed",
    },
  },
  {
    tableName: "event_ticket",
    timestamps: true,
    underscored: true,
  }
);

module.exports = EventTicket;
