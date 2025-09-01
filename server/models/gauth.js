const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");

const GUser = sequelize.define("GUser", {
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  image: {
    type: DataTypes.STRING,
    defaultValue:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
}, {
  timestamps: true,
});

module.exports = GUser;
