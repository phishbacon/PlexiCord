<script setup lang="ts">
import log from "electron-log/renderer";
import { computed, onMounted, ref, toRaw, watch } from "vue";

import type { Config } from "./lib/types/config";
import type { Connection, Resource } from "./lib/types/plex";

import ConnectionSelect from "./components/ConnectionSelect.vue";
import Login from "./components/Login.vue";
import MusicPlayer from "./components/MusicPlayer.vue";
import Navbar from "./components/Navbar.vue";
import ServerSelect from "./components/ServerSelect.vue";
import { pollSession } from "./composables/poll-session";
import { WAIT_LONGER_TO_APPEAR_FASTER_MS } from "./lib/contants";

const config = ref<Config | undefined>(undefined);
const appReady = ref(false);
const loggedIn = ref(false);
const avatar = ref<string | undefined>(undefined);
const servers = ref<Array<Resource> | undefined>(undefined);
const configReadyToWrite = ref(false);

const server = computed((): Resource | undefined => {
  return servers.value?.find(e => e.name === config.value?.client.serverName);
});

const connections = computed((): Array<Connection> | undefined => {
  return server.value?.connections;
});

const { session, startPolling } = pollSession();

watch(
  config,
  async () => {
    if (configReadyToWrite.value && config.value) {
      window.api.config.stageConfig(toRaw(config.value));
    }
    if (config.value?.client.connectionAddress) {
      startPolling();
    }
  },
  { deep: true },
);

onMounted(async () => {
  setTimeout(async () => {
    config.value = await window.api.config.getConfig();
    if (config.value?.client.token) {
      await window.api.config.authenticateClient();
      const account = await window.api.plex.getPlexAccount();
      if (account) {
        avatar.value = account.thumb;
        loggedIn.value = true;
        const serversData = await window.api.plex.getPlexServers();
        servers.value = serversData;
        config.value = await window.api.config.getConfig();
        configReadyToWrite.value = true;
      }
    }
    else {
      log.info(`No auth token loaded. User needs to authenticate.`);
    }
    appReady.value = true;
    await window.api.discord.initRPC();
  }, WAIT_LONGER_TO_APPEAR_FASTER_MS);
});

async function login() {
  if (config.value) {
    await window.api.config.authenticateClient();
    const account = await window.api.plex.getPlexAccount();
    if (account) {
      avatar.value = account.thumb;
      loggedIn.value = true;
      const serversData = await window.api.plex.getPlexServers();
      servers.value = serversData;
      config.value = await window.api.config.getConfig();
      configReadyToWrite.value = true;
    }
  }
  else {
    log.info(`No config loaded.... Ideally we shouldn't be able to get here`);
  }
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <Navbar v-show="loggedIn" :avatar="avatar" />
  </Transition>
  <div :class="loggedIn ? 'h-[calc(100vh-4rem)]' : 'hero min-h-screen'" class="bg-base-200">
    <div class="flex justify-center h-full p-2">
      <Transition v-if="!loggedIn" name="fade" mode="out-in" class="justify-center text-center">
        <Login v-if="appReady" @login="login" />
        <progress v-else class="progress w-56" />
      </Transition>
      <div v-else-if="config" class="flex flex-col w-full justify-center">
        <ServerSelect v-model:server-name="config.client.serverName" :servers="servers" class="w-full my-2 fade-enter-active" :class="servers ? '' : 'fade-enter-from'" />
        <ConnectionSelect v-model:connection-address="config.client.connectionAddress" :connections="connections" class="w-full my-2 fade-enter-active" :class="connections ? '' : 'fade-enter-from'" />
        <MusicPlayer :config="config" :session="session" class="w-full my-2 fade-enter-active" :class="session ? '' : 'fade-enter-from'" />
      </div>
    </div>
  </div>
</template>
