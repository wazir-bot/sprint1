const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Get single user (exclude password)
const getuser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).send("User not found");
    return res.send(user);
  } catch (error) {
    res.status(500).send("Unable to get user");
  }
};

// ✅ Get all users except logged-in
const getallusers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { id: { [require("sequelize").Op.ne]: req.locals } },
      attributes: { exclude: ["password"] },
    });
    return res.send(users);
  } catch (error) {
    res.status(500).send("Unable to get all users");
  }
};

// ✅ Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // only take what's needed

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).send("Incorrect credentials");

    const verifyPass = await bcrypt.compare(password, user.password);
    if (!verifyPass) return res.status(400).send("Incorrect credentials");

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin, role: user.role },
      process.env.JWT_SECRET || "defaultSecret",  // fallback
      { expiresIn: "2 days" }
    );

    return res.status(200).send({
      msg: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).send("Unable to login user");
  }
};


// ✅ Register
// ✅ Register User
const register = async (req, res) => {
  try {
    console.log("📥 Incoming register request:", req.body);

    // 1. Check if email exists
    const emailPresent = await User.findOne({ where: { email: req.body.email } });
    console.log("🔎 Email check result:", emailPresent);
    if (emailPresent) {
      console.log("⚠️ Email already exists:", req.body.email);
      return res.status(400).send("Email already exists");
    }

    // 2. Hash password
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    console.log("🔑 Password hashed");

    // 3. Create user
    const user = await User.create({ ...req.body, password: hashedPass });
    console.log("✅ User created:", user?.id);

    if (!user) {
      console.log("❌ User creation failed");
      return res.status(500).send("Unable to register user");
    }

    return res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    console.error(error);
    res.status(500).json({ error: "Unable to register user", details: error.message });
  }
};



// ✅ Update Profile
const updateprofile = async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const result = await User.update(
      { ...req.body, password: hashedPass },
      { where: { id: req.locals } }
    );
    if (!result[0]) return res.status(500).send("Unable to update user");
    return res.status(201).send("User updated successfully");
  } catch (error) {
    res.status(500).send("Unable to update user");
  }
};

// ✅ Change Password
const changepassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword)
      return res.status(400).send("Passwords do not match");

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).send("User not found");

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) return res.status(400).send("Incorrect current password");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });

    return res.status(200).send("Password changed successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

// ✅ Delete User (also doctor + appointment if exist)
const deleteuser = async (req, res) => {
  try {
    await Appointment.destroy({ where: { userId: req.body.userId } });
    await Doctor.destroy({ where: { userId: req.body.userId } });
    await User.destroy({ where: { id: req.body.userId } });

    return res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Unable to delete user");
  }
};

// ✅ Forgot Password (send email)
const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).send({ status: "User not found" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1m" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saudshaikh0763@gmail.com",
        pass: "saud1234",
      },
    });

    const mailOptions = {
      from: "saudshaikh0763@gmail.com",
      to: email,
      subject: "Reset Password Link",
      text: `https://appointmentdoctor.netlify.app/resetpassword/${user.id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) return res.status(500).send({ status: "Error sending email" });
      else return res.status(200).send({ status: "Email sent successfully" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: "Internal Server Error" });
  }
};

// ✅ Reset Password
const resetpassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, async (err) => {
      if (err) return res.status(400).send({ error: "Invalid or expired token" });

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.update({ password: hashedPassword }, { where: { id } });
        return res.status(200).send({ success: "Password reset successfully" });
      } catch (updateError) {
        console.error("Error updating password:", updateError);
        return res.status(500).send({ error: "Failed to update password" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  getuser,
  getallusers,
  login,
  register,
  updateprofile,
  deleteuser,
  changepassword,
  forgotpassword,
  resetpassword,
};
