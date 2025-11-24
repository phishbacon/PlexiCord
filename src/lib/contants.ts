export const PLEX_PRODUCT = "PlexiCord";
export const PLEX_API_BASE_URL = "https://plex.tv/api/v2";
export const USER_ENDPOINT = `${PLEX_API_BASE_URL}/user`;
export const PIN_ENDPOINT = `${PLEX_API_BASE_URL}/pins`;
export const RESOURCES_ENDPOINT = `${PLEX_API_BASE_URL}/resources`;
export const AUTH_ENDPOINT = "https://app.plex.tv/auth#";
export const ONE_SECOND = 1000;
export const SESSIONS_ENDPOINT = "/status/sessions";
export const MAIN_WINDOW_WIDTH = 360;
export const MAIN_WINDOW_HEIGHT = 430;
export const AUTH_POLL_INTERVAL_MS = 1000;
export const AUTH_POLL_TIMEOUT_MS = 60 * ONE_SECOND;
export const WAIT_LONGER_TO_APPEAR_FASTER_MS = 1000;
export const ProductKey = "X-Plex-Product";
export const ClientIDKey = "X-Plex-Client-Identifier";
export const TokenKey = "X-Plex-Token";
export const DEFAULT_SESSION_POLLING_INTERVAL = 3 * ONE_SECOND;
export const SESSION_POLLING_TIMEOUT = 20 * ONE_SECOND;
export const PLEXICORD_DISCORD_CLIENT_ID = "1442553843220086814";

export enum ACTIVITY_TYPE {
  Playing = 0,
  Listening = 2,
  Competing = 5,
}
