<script setup lang="ts">
import type { PropType } from "vue";

import { computed } from "vue";

import type { Connection } from "../lib/types/plex";

const props = defineProps({
  connections: {
    type: Array as PropType<Array<Connection>>,
    required: false,
  },
  connectionAddress: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  "update:connectionAddress": [value: string];
}>();

const placeholder = computed(() => {
  return !props.connections || props.connections.length === 0 ? "Loading Connections" : "Select a Connection";
});

function onSelect(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit("update:connectionAddress", target.value);
}
</script>

<template>
  <label class="select select-secondary">
    <span class="label w-1/2">Connection</span>
    <select :value="connectionAddress ?? ''" class="select" @change="onSelect">
      <option disabled value="">
        {{ placeholder }}
      </option>
      <option v-for="connection in connections" :key="connection.uri" :value="connection.uri">
        {{ connection.address }}
      </option>
    </select>
  </label>
</template>
