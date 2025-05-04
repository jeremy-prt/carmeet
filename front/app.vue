<template>
  <div>
    <Default />
    <NuxtPage />
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
console.log("MAPBOX_TOKEN:", config.public.mapboxToken);
import Default from "~/components/layouts/default.vue";
</script>
