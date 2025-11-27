const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware, requireRole("ADMIN"));

router.get("/users", async (_, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role", "createdAt"]
  });
  res.json({ users });
});

router.post("/users", async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash, role });

  res.status(201).json({ message: "User created" });
});

router.delete("/users/:id", async (req, res) => {
  if (Number(req.params.id) === req.user.id)
    return res.status(400).json({ message: "Cannot delete self" });

  const deleted = await User.destroy({ where: { id: req.params.id } });
  if (!deleted)
    return res.status(404).json({ message: "User not found" });

  res.json({ message: "User deleted" });
});

module.exports = router;
