import log from "electron-log/main";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import type { Config } from "./types/config";

import { getPinCode, tokenDance, validateToken } from "./auth";
import { ClientIDKey, PLEX_PRODUCT, ProductKey, TokenKey } from "./contants";

let config!: Config;
let configPath: string = "./plexicord.json";

export async function setPath() {
  try {
    await fs.access(path.join(process.resourcesPath, "plexicord.json"), fs.constants.W_OK);
    configPath = path.join(process.resourcesPath, "plexicord.json");
  }
  catch {
    ;
  }
}

async function readConfig(): Promise<Config> {
  try {
    const fileText = await fs.readFile(configPath, { encoding: "utf-8" });
    return JSON.parse(fileText) as Config;
  }
  catch (error) {
    throw new Error(`Failed to read or parse JSON file at ${configPath}: ${error}`);
  }
};

async function writeConfig(): Promise<void> {
  let configPath = "./plexicord.json";
  try {
    await fs.access(path.join(process.resourcesPath, "plexicord.json"), fs.constants.W_OK);
    configPath = path.join(process.resourcesPath, "plexicord.json");
  }
  catch {
    ;
  }

  try {
    const fileText = JSON.stringify(config, null, 2); // Pretty-print with 2 spaces
    await fs.writeFile(configPath, fileText, { encoding: "utf-8" });
  }
  catch (error) {
    throw new Error(`Failed to write JSON file at ${configPath}: ${error}`);
  }
};

async function validateConfig(): Promise<boolean> {
  try {
    // if clientID is missing, generate a new one we can continue from here since
    // clientID is something we provide
    if (!config.client.ID) {
      log.info("Client ID missing from config, generating a new one.");
      config.client.ID = randomUUID();
    }

    // if token is missing, this means the user hasn't logged in yet
    if (!config.client.token) {
      log.info("Token missing from config. User needs to log in.");
      return false;
    }
    else {
      const validToken = await validateToken();
      if (!validToken) {
        return false;
      }
    }
  }
  catch (error) {
    log.error("Error validating config:", error);
    throw error;
  }

  return true;
};

export async function getConfig(): Promise<Config> {
  if (config) {
    return config;
  }
  else {
    log.info("reading config from file");
    config = await readConfig();
  }
  return config;
}

export function stageConfig(newConfig: Config): void {
  log.info("updating config");
  log.debug(`config before: ${JSON.stringify(config)}`);
  config = newConfig;
  log.debug(`config after: ${JSON.stringify(config)}`);
}

export async function setConfig(): Promise<void> {
  log.info("writing config to file");
  await writeConfig();
}

export function getTokenValidationQuery(): string {
  const str = `?${ProductKey}=${PLEX_PRODUCT}&${ClientIDKey}=${config.client.ID}&${TokenKey}=${config.client.token}`;
  log.debug(`token validation query: ${str}`);
  return str;
};

export function getPinRequestQuery(): string {
  const str = `?${ProductKey}=${PLEX_PRODUCT}&${ClientIDKey}=${config.client.ID}&strong=true`;
  log.debug(`pin request query: ${str}`);
  return str;
};

export function getAuthRequestQuery(code: string): string {
  const str = `?clientID=${config.client.ID}&code=${code}&context%5Bdevice%5D%5Bproduct%5D=${PLEX_PRODUCT}&forwardUrl=`;
  log.debug(`auth request query: ${str}`);
  return str;
};

export function getPollingPinQuery(code: string): string {
  const str = `${config.client.pinID}?code=${code}&X-Plex-Client-Identifier=${config.client.ID}`;
  log.debug(`polling pin query: ${str}`);
  return str;
}

export async function authenticateClient(): Promise<void> {
  try {
    const validConfig = await validateConfig();
    if (!validConfig) {
      log.info("Token is invalid or expired. Initiating token dance...");
      const pin = await getPinCode();
      config.client.pinID = pin.pinID;
      // get auth url
      config.client.token = await tokenDance(getAuthRequestQuery(pin.pinCode), getPollingPinQuery(pin.pinCode));
    }
    await writeConfig();
  }
  catch (error) {
    log.error(error);
    throw error;
  }
}
