import { app as n, BrowserWindow as i } from "electron";
import e from "node:path";
import { fileURLToPath as r } from "node:url";
const s = e.dirname(r(import.meta.url));
process.env.DIST_ELECTRON = e.join(s, "..");
process.env.DIST = e.join(process.env.DIST_ELECTRON, "dist");
process.env.VITE_PUBLIC = n.isPackaged ? process.env.DIST : e.join(process.env.DIST_ELECTRON, "public");
let o;
function t() {
  o = new i({
    width: 1200,
    height: 800,
    icon: e.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: e.join(s, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), o.webContents.on("did-finish-load", () => {
    o?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), process.env.VITE_DEV_SERVER_URL ? o.loadURL(process.env.VITE_DEV_SERVER_URL) : o.loadFile(e.join(process.env.DIST, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), o = null);
});
n.on("activate", () => {
  i.getAllWindows().length === 0 && t();
});
n.whenReady().then(t);
