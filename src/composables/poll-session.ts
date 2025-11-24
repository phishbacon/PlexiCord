import { onUnmounted, ref } from "vue";

import type { Session } from "./types/poll-session";

import { ACTIVITY_TYPE, DEFAULT_SESSION_POLLING_INTERVAL, ONE_SECOND, SESSION_POLLING_TIMEOUT } from "../lib/contants";

export function pollSession(interval: number = DEFAULT_SESSION_POLLING_INTERVAL) {
  const session = ref<Session | undefined>(undefined);

  let pollTimer: number | undefined;
  let tickTimer: number | undefined;
  const lastSyncedSession: Session = {
    title: "",
    album: "",
    artist: "",
    thumb: "",
    duration: 0,
    offset: 0,
    state: "",
    year: 0,
  };
  let lastSyncedSessionTime: number | undefined;
  let fetchingData = false;

  async function fetchData() {
    if (fetchingData) {
      return;
    }

    fetchingData = true;
    const metadata = await window.api.plex.getMetadata();
    if (metadata) {
      const now = Date.now();
      // if any keys are different lets put this new data into session
      if (lastSyncedSession.title !== metadata.title
        || lastSyncedSession.album !== metadata.parentTitle
        || lastSyncedSession.year !== metadata.parentYear
        || lastSyncedSession.artist !== metadata.grandparentTitle
        || lastSyncedSession.thumb !== metadata.thumb
        || lastSyncedSession.duration !== metadata.duration
        || lastSyncedSession.offset !== metadata.viewOffset
        || lastSyncedSession.state !== metadata.Player.state
      ) {
        lastSyncedSession.title = metadata.title;
        lastSyncedSession.album = metadata.parentTitle;
        lastSyncedSession.year = metadata.parentYear;
        lastSyncedSession.artist = metadata.grandparentTitle;
        lastSyncedSession.thumb = metadata.thumb;
        lastSyncedSession.duration = metadata.duration;
        lastSyncedSession.offset = metadata.viewOffset;
        lastSyncedSession.state = metadata.Player.state;
        session.value = { ...lastSyncedSession };
        lastSyncedSessionTime = Date.now();
      }
      // hasn't changed in over 20 seconds
      else if (lastSyncedSessionTime && now - lastSyncedSessionTime >= SESSION_POLLING_TIMEOUT) {
        session.value = undefined;
      }
    }

    fetchingData = false;
    if (session.value) {
      window.api.discord.setActivity(
        session.value.title,
        session.value.artist,
        ACTIVITY_TYPE.Listening,
        session.value.thumb,
        `${session.value.album} (${session.value.year})`,
        session.value.state === "paused" ? Date.now() : Date.now() - session.value.offset,
        session.value.state === "paused" ? Date.now() : Date.now() + (session.value.duration - session.value.offset),
      );
    }
    else {
      window.api.discord.clearActivity();
    }
  }

  function startTicking() {
    if (tickTimer) {
      return;
    }

    tickTimer = window.setInterval(() => {
      if (session.value && session.value.state !== "paused") {
        session.value.offset += ONE_SECOND;
      }
    }, ONE_SECOND);
  }

  function stopTicking() {
    if (tickTimer) {
      clearInterval(tickTimer);
      tickTimer = undefined;
    }
  }

  function startPolling() {
    if (pollTimer) {
      return;
    }

    pollTimer = window.setInterval(() => {
      fetchData();
    }, interval);

    startTicking();
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = undefined;
    }

    stopTicking();
  }

  onUnmounted(() => {
    stopPolling();
    window.api.discord.destroy();
  });

  return { session, startPolling, stopPolling };
}
