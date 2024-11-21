import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    name: "GemiTab",
    version: "0.0.1",
    permissions: [
      "storage",
      "tabs",
      "tabGroups",
      "tabCapture",
      "activeTab",
      "scripting",
    ],
    host_permissions: ["*://*/*"],
    content_scripts: [
      { matches: ["<all_urls>"], js: ["content-scripts/content.js"] },
    ],
    content_security_policy: {
      extension_pages:
        "script-src-elem 'self' 'unsafe-eval' http://localhost:3000; script-src 'self' 'wasm-unsafe-eval' http://localhost:3000; object-src 'self';",
      sandbox:
        "script-src-elem 'self' 'unsafe-eval' http://localhost:3000; script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000; sandbox allow-scripts allow-forms allow-popups allow-modals; child-src 'self';",
    },
  },
  runner: {
    disabled: true,
  },
});
