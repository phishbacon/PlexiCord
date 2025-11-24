import { ipcRenderer } from "electron";

export function exposeModule(moduleName: string, module: any) {
  const api: Record<string, (...args: any[]) => any> = {};
  for (const [key, value] of Object.entries(module)) {
    if (typeof value === "function") {
      api[key] = (...args: any[]) => ipcRenderer.invoke(`${moduleName}:${key}`, ...args);
    }
  }
  return api;
}
