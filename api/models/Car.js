const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Car = sequelize.define(
  "Car",
  {
    id_car: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    transmission: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fuel_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "car",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Car;
