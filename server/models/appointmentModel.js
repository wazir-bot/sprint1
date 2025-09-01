const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");
const User = require("./userModel");
const Doctor = require("./doctorModel");

const Appointment = sequelize.define("Appointment", {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending", // can be 'pending', 'approved', 'cancelled'
  },
}, {
  timestamps: true,
});

// 🟢 Associations
Appointment.belongsTo(User, { foreignKey: "userId" });   // patient
Appointment.belongsTo(Doctor, { foreignKey: "doctorId" });

User.hasMany(Appointment, { foreignKey: "userId" });
Doctor.hasMany(Appointment, { foreignKey: "doctorId" });

module.exports = Appointment;
