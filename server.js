require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { connectDB, sequelize } = require("./config/db");
const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  const exists = await User.findOne({ where: { email } });
  if (exists) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    name: "Admin",
    email,
    passwordHash,
    role: "ADMIN"
  });

  console.log("Admin user seeded");
}

(async () => {
  await connectDB();
  await sequelize.sync(); // creates tables
  await seedAdmin();

  app.listen(5000, () =>
    console.log("Server running on http://localhost:5000")
  );
})();
