const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const QRCode = sequelize.define(
  "QRCode",
  {
    id_qrcode: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    qrcode_data: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qrcode_image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "qrcode",
    timestamps: true,
    underscored: true,
  }
);

module.exports = QRCode;
