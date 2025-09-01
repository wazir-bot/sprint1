const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("hey_doc", "root", "saud1234", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log("✅ MySQL Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

module.exports = sequelize;
