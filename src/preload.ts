import { contextBridge } from "electron";

import * as auth from "./lib/auth";
import * as config from "./lib/config";
import * as discord from "./lib/discord";
import { exposeModule } from "./lib/invoke";
import * as plex from "./lib/plex";

contextBridge.exposeInMainWorld("api", {
  config: exposeModule("config", config),
  auth: exposeModule("auth", auth),
  plex: exposeModule("plex", plex),
  discord: exposeModule("discord", discord),
});
