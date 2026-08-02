export type Theme = "light" | "neutral" | "dark";
export const THEME_STORAGE_KEY = "buildwise-theme";

const THEME_CLASSES = ["light", "neutral"] as const;
const listeners = new Set<() => void>();

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "neutral" || value === "dark";
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "dark";
  } catch {
    return "dark";
  }
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove(...THEME_CLASSES);
  if (theme !== "dark") root.classList.add(theme);
}

export function setTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
  }

  applyTheme(theme);
  listeners.forEach((listener) => listener());
}

export function subscribeToTheme(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
