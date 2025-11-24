import { shell } from "electron";
import log from "electron-log/main";

import type { PinResponse } from "./types/auth";

import { getPinRequestQuery, getTokenValidationQuery } from "./config";
import { AUTH_ENDPOINT, AUTH_POLL_INTERVAL_MS, AUTH_POLL_TIMEOUT_MS, PIN_ENDPOINT, USER_ENDPOINT } from "./contants";

export async function validateToken(): Promise<boolean> {
  try {
    const response = await fetch(`${USER_ENDPOINT}${getTokenValidationQuery()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 200) {
      return true;
    }
    else {
      return false;
    }
  }
  catch (error) {
    log.error("error validating token:", error);
    throw error;
  }
};

export async function tokenDance(authQueryString: string, pinPollingQueryString: string): Promise<string> {
  // if we are here then we are assuming the token is invalid or missing
  try {
    shell.openExternal(`${AUTH_ENDPOINT}${authQueryString}`);
    const token = await pollUserSignIn(pinPollingQueryString);
    log.info(token);
    return token;
  }
  catch (error) {
    log.error("error during token dance:", error);
    throw error;
  }
}

export async function getPinCode(): Promise<PinResponse> {
  try {
    const response = await fetch(`${PIN_ENDPOINT}${getPinRequestQuery()}`, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    });

    if (response.ok) {
      const res = await response.json();
      log.info("pin request successful:", res.id);
      return {
        pinID: res.id,
        pinCode: res.code,
      };
    }
    else {
      throw new Error(`Pin request failed with status ${response.status}`);
    }
  }
  catch (error) {
    log.error("error getting pin code:", error);
    throw error;
  }
}

export async function pollUserSignIn(pinPollingQueryString: string): Promise<string> {
  return new Promise<string>((resolve) => {
    let timeout: NodeJS.Timeout;

    const poll = setInterval(async () => {
      const token = await getAuthToken(pinPollingQueryString);
      if (token) {
        clearInterval(poll);
        clearTimeout(timeout);
        resolve(token);
      }
    }, AUTH_POLL_INTERVAL_MS);

    timeout = setTimeout(() => {
      clearInterval(poll);
      resolve("");
    }, AUTH_POLL_TIMEOUT_MS);
  });
};

export async function getAuthToken(pinPollingQueryString: string): Promise<string> {
  let token;
  try {
    log.info("checking for pin authorization...");
    const response = await fetch(`${PIN_ENDPOINT}/${pinPollingQueryString}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    const res = await response.json();
    log.debug(res);
    if (res.authToken) {
      log.info("pin authorized, received auth token.");
      token = res.authToken;
    }
  }
  catch (error) {
    log.error("error polling pin:", error);
    throw error;
  }

  return token;
}
