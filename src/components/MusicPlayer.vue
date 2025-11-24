<script setup lang="ts">
import type { PropType } from "vue";

import log from "electron-log/renderer";
import { computed } from "vue";

import type { Session } from "../composables/types/poll-session";
import type { Config } from "../lib/types/config";

import { TokenKey } from "../lib/contants";

const props = defineProps({
  session: {
    type: Object as PropType<Session>,
    required: false,
  },
  config: {
    type: Object as PropType<Config>,
    required: true,
  },
});

const src = computed((): string => {
  const thumbSrc = `${props.config?.client.connectionAddress}${props.session?.thumb}?${TokenKey}=${props.config.client.token}`;
  log.debug(thumbSrc);
  return thumbSrc;
});

const offsetString = computed((): string => {
  if (props.session) {
    const offset = props.session.offset;
    const seconds = String(Math.trunc((offset / 1000) % 60)).padStart(2, "0");
    const minutes = String(Math.trunc((offset / (60 * 1000)) % 60));
    return `${minutes}:${seconds}`;
  }
  else {
    return "00:00";
  }
});

const durationString = computed((): string => {
  if (props.session) {
    const duration = props.session.duration;
    const seconds = String(Math.trunc((duration / 1000) % 60)).padStart(2, "0");
    const minutes = String(Math.trunc((duration / (60 * 1000)) % 60));
    return `${minutes}:${seconds}`;
  }
  else {
    return "00:00";
  }
});
</script>

<template>
  <div class="card bg-base-100 shadow-md self-center h-32 flex flex-row p-2">
    <Transition class="mr-1" name="fade" mode="out-in">
      <img
        v-if="session?.thumb"
        :src="src"
        class="rounded w-28"
      >
      <div v-else class="flex justify-center w-28 h-28 border rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
        </svg>
      </div>
    </Transition>
    <Transition class="ml-1" name="fade" mode="out-in">
      <div v-if="session" class="flex flex-col overflow-hidden h-28 w-full justify-between">
        <div class="flex flex-col text-left h-2/3 justify-between">
          <p class="text-sm truncate">
            {{ session.title }}
          </p>
          <p class="text-xs truncate">
            {{ session.artist }} ({{ session.year }})
          </p>
          <p class="text-xs truncate">
            {{ session.album }}
          </p>
        </div>
        <div class="flex flex-row h-6">
          <p class="offset text-right mr-2 content-center-safe text-xs">
            {{ offsetString }}
          </p>
          <progress class="progress progress-accent w-full h-1 self-center-safe" :value="session && session.offset > 0 ? session.offset : 1" :max="session && session.duration > 0 ? session.duration : 1" />
          <p class="duration text-left ml-2 content-center-safe text-xs">
            {{ durationString }}
          </p>
        </div>
      </div>
      <div v-else class="flex flex-col session-details overflow-hidden h-28 w-full justify-between">
        <div class="flex flex-col text-left h-2/3 justify-between">
          <p class="text-sm truncate">
            Song
          </p>
          <p class="text-xs truncate">
            Artist
          </p>
          <p class="text-xs truncate">
            Album
          </p>
        </div>
        <div class="flex flex-row h-6">
          <p class="offset text-right mr-2 content-center-safe text-xs">
            {{ offsetString }}
          </p>
          <progress class="progress progress-accent w-full h-1 self-center-safe" :value="1" :max="1" />
          <p class="duration text-left ml-2 content-center-safe text-xs">
            {{ durationString }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>
