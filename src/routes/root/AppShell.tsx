import { Link, Outlet } from "@tanstack/react-router";
import { GitBranch, GraduationCap } from "lucide-react";
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
      <footer className="app-footer">
        <a
          className="footer-link"
          href="https://github.com/gedex/kuisin"
          target="_blank"
          rel="noreferrer"
        >
          <GitBranch size={16} aria-hidden="true" />
          <span>gedex/kuisin</span>
        </a>
      </footer>
    </div>
  );
}
