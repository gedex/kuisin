import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useLocalStorageState } from "../lib/storage";
import "./ThemeSwitcher.css";

type ThemeChoice = "light" | "dark";
type StoredThemeChoice = ThemeChoice | "system";

const choices: Array<{
  value: ThemeChoice;
  label: string;
  icon: typeof Sun;
}> = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
];

function getSystemTheme(): ThemeChoice {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorageState<StoredThemeChoice>(
    "kuisin:theme",
    getSystemTheme(),
  );
  const activeTheme: ThemeChoice =
    theme === "light" || theme === "dark" ? theme : getSystemTheme();

  useEffect(() => {
    document.documentElement.dataset.theme = activeTheme;

    if (theme !== activeTheme) {
      setTheme(activeTheme);
    }
  }, [activeTheme, setTheme, theme]);

  return (
    <div className="theme-switcher" aria-label="Pilihan tema">
      {choices.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          className={activeTheme === value ? "active" : ""}
          onClick={() => setTheme(value)}
          aria-label={`Tema ${label}`}
          title={`Tema ${label}`}
        >
          <Icon size={17} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
