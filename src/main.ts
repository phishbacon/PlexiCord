import type { NativeImage } from "electron";

import { app, BrowserWindow, Menu, Tray } from "electron";
import log from "electron-log/main";
import started from "electron-squirrel-startup";
import path from "node:path";

import * as auth from "./lib/auth";
import * as config from "./lib/config";
import { MAIN_WINDOW_HEIGHT, MAIN_WINDOW_WIDTH } from "./lib/contants";
import * as discord from "./lib/discord";
import { registerHandlers } from "./lib/handle";
import * as plex from "./lib/plex";
import { getIcon } from "./lib/util";

let isQuitting = false;
let isDebug!: boolean;
let windowIcon!: NativeImage;
let trayIcon!: NativeImage;
let dockIcon!: NativeImage;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: MAIN_WINDOW_WIDTH,
    height: MAIN_WINDOW_HEIGHT,
    minWidth: MAIN_WINDOW_WIDTH,
    minHeight: MAIN_WINDOW_HEIGHT,
    maxHeight: isDebug ? undefined : MAIN_WINDOW_HEIGHT,
    maxWidth: isDebug ? undefined : MAIN_WINDOW_WIDTH,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    icon: windowIcon,
  });
  mainWindow.setMenu(null);

  if (process.platform === "darwin") {
    app.dock?.setIcon(dockIcon);
  }

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  }
  else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  if (isDebug) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      mainWindow.setSkipTaskbar(true);
      if (process.platform === "darwin") {
        app.dock?.hide();
      }
    }
  });

  return mainWindow;
}

async function createTray(mainWindow: BrowserWindow): Promise<Tray> {
  const tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show PlexiCord",
      click: () => {
        mainWindow.show();
        mainWindow.setSkipTaskbar(false);
      },
    },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    mainWindow.show();
    mainWindow.setSkipTaskbar(false);
    if (process.platform === "darwin") {
      app.dock?.show();
    }
  });

  return tray;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  log.initialize();

  log.debug(process.argv);
  config.setPath();

  isDebug = process.argv.findIndex(arg => (arg === "--debug" || arg === "-d")) > 0;

  log.transports.file.level = isDebug ? "debug" : "info";
  log.transports.console.level = isDebug ? "debug" : "info";

  if (isDebug) {
    log.info("================================DEBUG================================");
  }
  else {
    log.info("================================INFO================================");
  }

  registerHandlers("config", config);
  registerHandlers("auth", auth);
  registerHandlers("plex", plex);
  registerHandlers("discord", discord);

  windowIcon = await getIcon("window");
  trayIcon = await getIcon("tray");
  dockIcon = await getIcon("dock");

  const mainWindow = createWindow();
  createTray(mainWindow);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", async () => {});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("quit", async () => {
  try {
    await config.setConfig();
  }
  catch (error) {
    log.error(error);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
