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
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
