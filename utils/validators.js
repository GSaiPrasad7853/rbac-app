function isStrongPassword(password) {
  if (!password || password.length < 8) return false;
  // Add more rules here if needed: numbers, uppercase, symbols, etc.
  return true;
}

module.exports = { isStrongPassword };
