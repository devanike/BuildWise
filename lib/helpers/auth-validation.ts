export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value: string) {
  if (!value.trim()) {
    return "Please enter your name.";
  }
  return null;
}

export function validateEmail(value: string) {
  if (!value.trim()) {
    return "Please enter your email address.";
  }
  if (!EMAIL_PATTERN.test(value)) {
    return "Please enter a valid email address.";
  }
  return null;
}

export function validatePassword(value: string) {
  if (!value) {
    return "Please enter a password.";
  }
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Please use at least ${MIN_PASSWORD_LENGTH} characters for your password.`;
  }
  return null;
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
) {
  if (!confirmation) {
    return "Please confirm your password.";
  }
  if (password !== confirmation) {
    return "Both passwords need to match. Please try again.";
  }
  return null;
}

export function firstError(...results: (string | null)[]) {
  return results.find((result) => result !== null) ?? null;
}
