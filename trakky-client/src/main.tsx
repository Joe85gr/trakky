import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/providers/theme.tsx";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/app/dashboards/page.tsx";
import { MainNav } from "./components/ui/main-nav.tsx";
import ErrorPage from "./app/error/page.tsx";
import ExpensesPage from "@/app/overview/page.tsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { PageContainer } from "@/components/ui/containers.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import SettingsPage from "@/app/settings/page.tsx";
import { HealthCheckProvider } from "@/components/providers/health-check.tsx";
import { AuthenticationCustomProvider } from "@/components/providers/authentication.tsx";

AOS.init({ once: true });

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/overview",
    element: <ExpensesPage></ExpensesPage>,
  },
  {
    path: "/dashboards",
    element: <DashboardPage></DashboardPage>,
  },
  {
    path: "/settings",
    element: <SettingsPage></SettingsPage>,
  },
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthenticationCustomProvider>
        <MainNav className="h-8 shadow-amber-700 flex items-center space-x-4 lg:space-x-6" >
          <HealthCheckProvider />
          <PageContainer>
            <RouterProvider router={router} />
            <Toaster />
          </PageContainer>
        </MainNav>
      </AuthenticationCustomProvider>
    </ThemeProvider>
  </React.StrictMode>
);
