import React from "react";
import ReactDOM from "react-dom/client";
import DataForm from "@/kpi-builder/data-form.tsx";
import "./index.css";
import KpiBuilder from "@/kpi-builder/kpi-builder.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@/routes/root.tsx";
import ErrorPage from "@/components/pages/error-page.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/data",
        element: <DataForm />,
      },
      {
        path: "/kpi-builder",
        element: <KpiBuilder />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
