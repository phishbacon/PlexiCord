import { Client } from "discord-rpc";
import log from "electron-log/main";

import { getConfig } from "./config";
import { PLEXICORD_DISCORD_CLIENT_ID, TokenKey } from "./contants";

let hasInit = false;

const client = new Client({
  clientId: PLEXICORD_DISCORD_CLIENT_ID,
  transport: "ipc",
});

export async function initRPC() {
  if (!hasInit) {
    client.on("ready", async () => {
      log.info("RPC ready!");
    });

    try {
      await client.login({ clientId: PLEXICORD_DISCORD_CLIENT_ID });
      hasInit = true;
    }
    catch (error) {
      log.error(error);
    }
  }
}

export async function setActivity(
  details: string,
  state: string,
  type: number,
  largeImageKey: string,
  largeImageText: string,
  startTimestamp: number,
  endTimestamp: number,
) {
  const config = await getConfig();
  largeImageKey = `${config.client.connectionAddress}${largeImageKey}?${TokenKey}=${config.client.token}`;
  client.setActivity({
    details,
    state,
    type,
    largeImageKey,
    largeImageText,
    startTimestamp,
    endTimestamp,
  });
};

export function clearActivity() {
  client.clearActivity();
}

export function destroy() {
  client.clearActivity();
  client.destroy();
}
