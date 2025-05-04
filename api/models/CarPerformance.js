const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CarPerformance = sequelize.define(
  "CarPerformance",
  {
    id_performance: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_car: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Chaque voiture ne peut avoir qu'une seule fiche de performance
    },
    horsepower: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_speed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acceleration: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    torque: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "car_performance",
    timestamps: true,
    underscored: true,
  }
);

module.exports = CarPerformance;
