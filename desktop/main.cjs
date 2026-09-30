const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1050,
    minHeight: 650,
    backgroundColor: "#07090e",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.FORGE_DEV_URL) {
    win.loadURL(process.env.FORGE_DEV_URL);
  } else {
    win.loadFile(path.join(__dirname, "..", "web", "dist", "index.html"));
  }
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
