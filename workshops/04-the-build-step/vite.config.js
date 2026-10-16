import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* This file is why your JSX works.

   @vitejs/plugin-react is the thing that rewrites every <tag /> into a
   function call before the browser ever sees it. Take this plugin out and
   every .jsx file in src/ becomes a syntax error.

   That is the build step, declared in four lines. You should never need to
   change this file. */

export default defineConfig({
  plugins: [react()],
  server: { host: true },   // so CodeSandbox can show the preview
});
