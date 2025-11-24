<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  login: [];
}>();

const authenticating = ref(false);

function onClick() {
  emit("login");
  authenticating.value = true;
}
</script>

<template>
  <div class="card">
    <h1 class="text-4xl font-bold">
      Login With Plex
    </h1>
    <p class="py-6">
      Are you ready to show off your superior taste in music?
    </p>
    <Transition name="fade" mode="out-in" class="w-full">
      <progress v-if="authenticating" class="progress w-56" />
      <button v-else class="btn btn-primary" @click="onClick">
        Get Started
      </button>
    </Transition>
  </div>
</template>
