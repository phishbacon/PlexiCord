<script setup lang="ts">
import type { PropType } from "vue";

import { computed } from "vue";

import type { Resource } from "../lib/types/plex";

const props = defineProps({
  servers: {
    type: Array as PropType<Array<Resource>>,
    required: false,
  },
  serverName: {
    type: String,
    required: false,
  },
});

const emit = defineEmits<{
  "update:serverName": [value: string];
}>();

const placeholder = computed(() => {
  return !props.servers || props.servers.length === 0 ? "Loading Servers" : "Select a Server";
});

function onSelect(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit("update:serverName", target.value);
}
</script>

<template>
  <label class="select select-primary">
    <span class="label w-1/2">Server</span>
    <select :value="serverName ?? ''" class="select" @change="onSelect">
      <option disabled value="">
        {{ placeholder }}
      </option>
      <option v-for="server in servers" :key="server.name" :value="server.name">
        {{ server.name }}
      </option>
    </select>
  </label>
</template>
