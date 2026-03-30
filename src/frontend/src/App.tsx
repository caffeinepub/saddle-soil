import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import { getSecretParameter } from "./utils/urlParams";

function RootComponent() {
  useEffect(() => {
    // Capture hash BEFORE getSecretParameter potentially clears it
    const hash = window.location.hash;
    const token = getSecretParameter("caffeineAdminToken"); // also stores in sessionStorage
    if (token && window.location.pathname !== "/admin") {
      // Use the original hash if available, otherwise rely on sessionStorage on admin page
      window.location.replace(`/admin${hash || ""}`);
    }
  }, []);

  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const routeTree = rootRoute.addChildren([indexRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
