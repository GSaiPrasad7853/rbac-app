const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isStrongPassword } = require("../utils/validators");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

/* REGISTER – STUDENT */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  if (!isStrongPassword(password))
    return res.status(400).json({ message: "Weak password" });

  const exists = await User.findOne({ where: { email } });
  if (exists)
    return res.status(400).json({ message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({ name, email, passwordHash });

  res.status(201).json({ message: "Registration successful" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing credentials" });

  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

/* CHANGE PASSWORD */
router.post("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const match = await bcrypt.compare(
    currentPassword,
    req.user.passwordHash
  );
  if (!match)
    return res.status(400).json({ message: "Invalid current password" });

  if (!isStrongPassword(newPassword))
    return res.status(400).json({ message: "Weak new password" });

  req.user.passwordHash = await bcrypt.hash(newPassword, 10);
  await req.user.save();

  res.json({ message: "Password updated" });
});

/* ME */
router.get("/me", authMiddleware, (req, res) => {
  const { passwordHash, ...safeUser } = req.user.dataValues;
  res.json({ user: safeUser });
});

module.exports = router;
