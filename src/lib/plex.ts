import log from "electron-log/main";

import type { Account, Metadata, Resource, Sessions } from "./types/plex";

import { getConfig } from "./config";
import { ClientIDKey, PLEX_PRODUCT, ProductKey, RESOURCES_ENDPOINT, SESSIONS_ENDPOINT, TokenKey, USER_ENDPOINT } from "./contants";

export async function getPlexAccount(): Promise<Account | undefined> {
  const config = await getConfig();
  const queryParams = `${ProductKey}=${PLEX_PRODUCT}&${ClientIDKey}=${config.client.ID}&${TokenKey}=${config.client.token}`;
  const response = await getPlexResponse<Account>(USER_ENDPOINT, queryParams);
  log.info(`returned account: ${JSON.stringify(response)}`);
  if (response) {
    config.client.username = response.username;
  }
  return response;
}

export async function getPlexServers(): Promise<Array<Resource> | undefined> {
  const config = await getConfig();
  const queryParams = `includeHttps=1&includeIPv6=1&${TokenKey}=${config.client.token}&${ClientIDKey}=${config.client.ID}`;
  const response = await getPlexResponse<Array<Resource>>(RESOURCES_ENDPOINT, queryParams);
  if (response) {
    const ownedServers = response.filter((e) => {
      return e.owned && e.provides === "server";
    });
    log.info(`returned owned servers: ${JSON.stringify(ownedServers)}`);
    return ownedServers;
  }
  return undefined;
}

export async function getMetadata(): Promise<Metadata | undefined> {
  const config = await getConfig();
  const queryParams = `${TokenKey}=${config.client.token}`;
  const response = await getPlexResponse<Sessions>(`${config.client.connectionAddress}${SESSIONS_ENDPOINT}`, queryParams);
  if (response) {
    if (response.MediaContainer.size > 0) {
      const metadata = response.MediaContainer.Metadata.find(e => e.type === "track" && e.User.title === config.client.username);
      log.debug(`returned metadata: ${JSON.stringify(metadata)}`);
      return metadata;
    }
  }
  return undefined;
}

async function getPlexResponse<T>(endpoint: string, queryParams: string): Promise<T | undefined> {
  const URL = `${endpoint}?${queryParams}`;
  log.info(`request URL: ${URL}`);
  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    }
  }
  catch (error) {
    log.error(error);
    return undefined;
  }
  return undefined;
}
