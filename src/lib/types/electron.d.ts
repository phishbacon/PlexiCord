export {};

declare global {
  interface Window {
    api: {
      config: typeof import("../config");
      auth: typeof import("../auth");
      plex: typeof import("../plex");
      discord: typeof import("../discord");
    };
  }
};
