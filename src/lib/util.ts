import type { NativeImage } from "electron";

import { app, nativeImage } from "electron";
import fs from "node:fs/promises";
import path from "node:path";

import type { IconType } from "./types/util";

export async function getIcon(type: IconType): Promise<NativeImage> {
  let ext;
  switch (process.platform) {
    case "darwin":
      if (type === "tray") {
        ext = "24x24.png";
      }
      else if (type === "dock") {
        ext = ".png";
      }
      else {
        ext = ".icns";
      }
      break;
    case "win32":
      if (type === "tray" || type === "window") {
        ext = ".ico";
      }
      break;
    default:
      ext = ".png";
      break;
  }

  const iconFile = `icon${ext}`;

  const prodPath = path.join(process.resourcesPath, "assets", iconFile);
  const devPath = path.join(app.getAppPath(), "src", "assets", iconFile);

  try {
    await fs.access(prodPath);
    return nativeImage.createFromPath(prodPath);
  }
  catch {
    // stays devPath
    return nativeImage.createFromPath(devPath);
  }
}
