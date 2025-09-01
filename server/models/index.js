const User = require("./userModel");
const Doctor = require("./doctorModel");
const Appointment = require("./appointmentModel");
const Notification = require("./notificationModel");

// ✅ Associations

// User ↔ Doctor (1-to-1)
User.hasOne(Doctor, { foreignKey: "userId", as: "doctor" });
Doctor.belongsTo(User, { foreignKey: "userId", as: "user" });

// User ↔ Appointment (1-to-Many)
User.hasMany(Appointment, { foreignKey: "userId", as: "appointments" });
Appointment.belongsTo(User, { foreignKey: "userId", as: "user" });

// Doctor ↔ Appointment (1-to-Many)
Doctor.hasMany(Appointment, { foreignKey: "doctorId", as: "appointments" });
Appointment.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctor" });

// User ↔ Notification (1-to-Many)
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  User,
  Doctor,
  Appointment,
  Notification,
};
