const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");

// User Model
const User = sequelize.define("User", {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3] }
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3] }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [5] }
  },
  role: {
    type: DataTypes.ENUM("Admin", "Doctor", "Patient"),
    allowNull: false,
    defaultValue: "Patient",   // 🔹 default makes sense
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    allowNull: true
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    allowNull: true,
    defaultValue: "pending",
  },
  pic: {
    type: DataTypes.STRING,
    defaultValue:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  }
}, {
  timestamps: true
});

module.exports = User;
