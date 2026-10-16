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
  server: {
    // Lets the dev server answer on a hostname that is not localhost. Without
    // it, CodeSandbox and anything else that proxies the preview get nothing.
    host: true,

    // And this is the one that actually bites.
    //
    // Vite 5.4.12 added a hostname check. If the request's Host header is not
    // one it recognises, it refuses with:
    //
    //   Blocked request. This host ("xxxxx-5173.csb.app") is not allowed.
    //
    // The check is there for a good reason - it stops a hostile web page from
    // pointing a DNS name at your machine and talking to a dev server running
    // on it. But a cloud sandbox serves the preview from a random subdomain
    // every time, so there is no fixed name to put on the list.
    //
    // true = accept any Host header. Fine here: this server is a throwaway
    // that only exists while you are working, and on your own laptop you
    // reach it on localhost anyway. On anything deployed, name the hosts
    // instead - allowedHosts: [".csb.app"] would have been enough for this one.
    allowedHosts: true,
  },
});
