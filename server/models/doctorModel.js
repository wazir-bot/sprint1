const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");
const User = require("./userModel"); // Import User for relation

// Doctor Model
const Doctor = sequelize.define("Doctor", {
  specialization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  feesPerConsultation: {   // 🔹 corrected spelling
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
}, {
  timestamps: true,
});

// 🟢 Associations
Doctor.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasOne(Doctor, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Doctor;
