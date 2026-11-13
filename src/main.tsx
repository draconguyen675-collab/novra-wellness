import App from "@/app/App";
import "@/shared/styles/editorial.css";
import "@/shared/styles/experiences.css";
import "@/shared/styles/global.css";
import "@/shared/styles/layout.css";
import "@/shared/styles/site.css";
import React from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
