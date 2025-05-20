const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load your frontend dist/index.html or URL
  win.loadFile(path.join(__dirname, "client", "dist", "index.html"));
}

app.whenReady().then(() => {
  // Start backend server as child process
  const backendPath = path.join(__dirname, "server", "index.js");

  backendProcess = spawn("node", [backendPath], {
    stdio: ["ignore", "pipe", "pipe"], // ignore stdin, pipe stdout & stderr
  });

  // Log backend stdout
  backendProcess.stdout.on("data", (data) => {
    console.log(`[Backend stdout]: ${data.toString()}`);
  });

  // Log backend stderr
  backendProcess.stderr.on("data", (data) => {
    console.error(`[Backend stderr]: ${data.toString()}`);
  });

  backendProcess.on("close", (code) => {
    console.log(`[Backend process exited] code: ${code}`);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Kill backend process when Electron app quits
app.on("will-quit", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

// Also quit app when all windows are closed (except macOS convention)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
