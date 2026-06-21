import { Link, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ErrorState } from "./components/ui/RouteState";
import { AppShell } from "./routes/root/AppShell";
import { HomePage } from "./routes/home/HomePage";
import {
  parseHomeSearch,
  type HomeSearch,
} from "./routes/home/homeSearch";
import { QuizPage } from "./routes/quiz/QuizPage";
import {
  parseQuizSearch,
  type QuizSearch,
} from "./routes/quiz/quizSearch";

const rootRoute = createRootRoute({
  component: AppShell,
  notFoundComponent: () => (
    <section className="detail-view">
      <Link className="back-link" to="/">
        <ArrowLeft size={18} aria-hidden="true" />
        Kembali
      </Link>
      <ErrorState message="Halaman ini belum tersedia." />
    </section>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
  validateSearch: (search: Record<string, unknown>): HomeSearch =>
    parseHomeSearch(search),
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kuis/$slug",
  component: QuizPage,
  validateSearch: (search: Record<string, unknown>): QuizSearch =>
    parseQuizSearch(search),
});

const routeTree = rootRoute.addChildren([indexRoute, quizRoute]);

function routerBasepath() {
  const base = import.meta.env.BASE_URL;
  if (!base || base === "/") return undefined;

  return base.replace(/\/$/, "");
}

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  basepath: routerBasepath(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
