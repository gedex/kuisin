import { Link, Outlet } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import "./AppShell.css";

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            <GraduationCap size={22} />
          </span>
          <span>Kuisin</span>
        </Link>
        <ThemeSwitcher />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
