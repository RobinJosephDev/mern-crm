export const getPasswordStrength = (password: string) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

export const strengthLabel = (score: number) => {
  switch (score) {
    case 0:
    case 1:
      return { label: "Weak", color: "text-red-600" };
    case 2:
      return { label: "Fair", color: "text-yellow-600" };
    case 3:
      return { label: "Good", color: "text-blue-600" };
    case 4:
      return { label: "Strong", color: "text-green-600" };
    default:
      return { label: "", color: "" };
  }
};
