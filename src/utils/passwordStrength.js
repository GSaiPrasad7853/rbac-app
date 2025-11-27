export function getPasswordStrength(password) {
  if (!password) return { label: "", score: 0 };

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = "Very Weak";
  if (score === 1) label = "Weak";
  if (score === 2) label = "Moderate";
  if (score === 3) label = "Strong";
  if (score >= 4) label = "Very Strong";

  return { label, score };
}
