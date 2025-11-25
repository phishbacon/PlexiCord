<script setup lang="ts">
import { PLEX_PRODUCT } from "../lib/contants";

defineProps({
  avatar: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div class="navbar shadow-sm">
    <div class="navbar-start">
      <a class="font-bold text-xl">{{ PLEX_PRODUCT }}</a>
    </div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              :src="avatar"
              loading="lazy"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
