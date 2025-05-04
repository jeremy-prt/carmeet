const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CarPhoto = sequelize.define(
  "CarPhoto",
  {
    id_photo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_car: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    photo_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "car_photo",
    timestamps: true,
    underscored: true,
  }
);

module.exports = CarPhoto;
