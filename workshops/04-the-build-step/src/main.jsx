/* src/main.jsx — the plug.

   Three lines of actual work: find the empty div in index.html, and render
   <App /> into it. This is the only place the app touches the page.

   You will not change this file again. */

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(<App />);
