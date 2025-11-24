import { ipcMain } from "electron";

export async function registerHandlers(moduleName: string, module: any) {
  for (const [key, value] of Object.entries(module)) {
    if (typeof value === "function") {
      const fn = value as (...args: any[]) => any;
      ipcMain.handle(`${moduleName}:${key}`, (event, ...args: any[]) => fn(...args));
    }
  }
}
