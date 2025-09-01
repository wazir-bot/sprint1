const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "hey_doc",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "saud1234",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: console.log, // 👈 log SQL queries (for debugging)
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected");
  } catch (err) {
    console.error("❌ MySQL connection failed:");
    console.error(err); // 👈 show full error object
  }
};

connectDB();

module.exports = sequelize;
