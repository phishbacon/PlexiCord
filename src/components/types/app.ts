import type { Config } from "../../lib/types/config";
import type { Resource } from "../../lib/types/plex";

export interface AppData {
  config?: Config;
  appReady: boolean;
  loggedIn: boolean;
  avatar?: string;
  servers?: Array<Resource>;
  serverName?: string;
}
