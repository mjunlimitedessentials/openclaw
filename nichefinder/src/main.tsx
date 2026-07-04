import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import "./index.css";

/** Mount the app. The #root element lives in index.html. */
const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
