export function validateName(name) {
  if (!name || !name.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  if (!/^[a-zA-Z\s]+$/.test(name.trim()))
    return "Name can only contain letters and spaces.";
  return "";
}

export function validateEmail(email) {
  if (!email || !email.trim()) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Enter a valid email address.";
  return "";
}

export function validatePassword(password) {
  if (!password) return "Password must be at least 8 characters.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
    return "Password must contain at least one special character.";
  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
}

export function validateOTP(otp) {
  if (!otp || !otp.trim()) return "OTP is required.";
  if (!/^\d{6}$/.test(otp.trim())) return "OTP must be exactly 6 digits.";
  return "";
}

export function validateSignupForm(form) {
  return {
    name: validateName(form.name),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    confirmPassword: validateConfirmPassword(
      form.password,
      form.confirmPassword,
    ),
  };
}

export function validateLoginForm(form) {
  return {
    email: validateEmail(form.email),
    password: form.password ? "" : "Password is required.",
  };
}

export function isFormValid(errors) {
  return Object.values(errors).every((e) => e === "");
}
