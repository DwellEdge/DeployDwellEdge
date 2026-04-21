import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style.css"; // custom styles

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
