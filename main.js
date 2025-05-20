const path = require("path");
const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false, // Adjust as per your security needs
      contextIsolation: true,
    },
  });

  const startURL = app.isPackaged
    ? `file://${path.join(__dirname, "/client/dist/index.html")}` // packaged path
    : `file://${path.join(__dirname, "/client/dist/index.html")}`; // dev build path or change to dev server URL if used

  mainWindow.loadURL(startURL);
  console.log(startURL, "startUrl");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Resolve backend server path
  const serverPath = app.isPackaged
    ? path.join(process.resourcesPath, "server") // packaged app resources/server
    : path.join(__dirname, "server"); // dev mode server folder
  console.log(serverPath, "serverpath");
  // Start backend Node process
  backendProcess = spawn("node", [path.join(serverPath, "index.js")]);

  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend stdout: ${data}`);
  });
  backendProcess.stderr.on("data", (data) => {
    console.error(`Backend stderr: ${data}`);
  });
  backendProcess.on("close", (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (backendProcess) {
      backendProcess.kill();
    }
    app.quit();
  }
});
