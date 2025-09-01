const { Op } = require("sequelize");
// controllers/appointmentController.js
const { Appointment, User, Doctor, Notification } = require("../models");

// ✅ Get all appointments
const getallappointments = async (req, res) => {
  try {
    let whereClause = {};

    if (req.query.search) {
      whereClause = {
        [Op.or]: [
          { userId: req.query.search },
          { doctorId: req.query.search },
        ],
      };
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        { model: Doctor, as: "doctor" },
        { model: User, as: "user" },
      ],
    });

    return res.send(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send("Unable to get appointments");
  }
};

// ✅ Book appointment
const bookappointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      date: req.body.date,
      time: req.body.time,
      age: req.body.age,
      bloodGroup: req.body.bloodGroup,
      gender: req.body.gender,
      number: req.body.number,
      familyDiseases: req.body.familyDiseases,
      doctorId: req.body.doctorId,
      userId: req.locals,
      status: "Pending",
    });

    // User notification
    await Notification.create({
      userId: req.locals,
      content: `You booked an appointment with Dr. ${req.body.doctorname} for ${req.body.date} ${req.body.time}`,
    });

    const user = await User.findByPk(req.locals);

    // Doctor notification
    await Notification.create({
      userId: req.body.doctorId,
      content: `You have an appointment with ${user.firstname} ${user.lastname} on ${req.body.date} at ${req.body.time}. Age: ${user.age}, Blood Group: ${user.bloodGroup}, Gender: ${user.gender}, Mobile: ${user.number}, Family Diseases: ${user.familyDiseases}`,
    });

    return res.status(201).send(appointment);
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).send("Unable to book appointment");
  }
};

// ✅ Mark appointment as completed
const completed = async (req, res) => {
  try {
    await Appointment.update(
      { status: "Completed" },
      { where: { id: req.body.appointid } }
    );

    // User notification
    await Notification.create({
      userId: req.locals,
      content: `Your appointment with ${req.body.doctorname} has been completed`,
    });

    const user = await User.findByPk(req.locals);

    // Doctor notification
    await Notification.create({
      userId: req.body.doctorId,
      content: `Your appointment with ${user.firstname} ${user.lastname} has been completed`,
    });

    return res.status(201).send("Appointment completed");
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).send("Unable to complete appointment");
  }
};

module.exports = {
  getallappointments,
  bookappointment,
  completed,
};
