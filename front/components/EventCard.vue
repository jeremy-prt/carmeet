<template>
  <NuxtLink
    :to="`/evenement/${event.id_event}`"
    class="bg-main/5 ring-1 ring-main/80 hover:ring-main cursor-pointer hover:bg-main/15 hover:ring-[1.5px] duration-300 rounded-xl p-4 flex flex-col gap-2 h-[200px] w-full"
  >
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-bold text-white truncate">
        {{ event.name }}
      </h3>
      <span
        class="bg-secondary/30 text-secondary w-fit text-xs font-semibold px-2 py-0.5 rounded-full uppercase"
        >{{ event.category }}</span
      >
    </div>
    <div class="flex items-center gap-2 text-xs text-gray-400 mb-1 mt-2">
      <span class="flex items-center gap-1"
        ><span class="text-main">📍</span>{{ event.city
        }}<span v-if="event.address">- {{ event.address }}</span></span
      >
    </div>
    <div class="flex items-center gap-2 text-xs text-gray-400 mb-1">
      <span class="flex items-center gap-1"
        ><span class="text-main">📅</span>{{ event.event_date }} à
        {{ event.event_time }}</span
      >
    </div>
    <div class="flex items-center gap-2 mt-auto">
      <span v-if="Number(event.price) > 0" class="text-main font-semibold"
        >{{ Number(event.price).toFixed(2) }} €</span
      >
      <span v-else class="text-green-400 font-semibold">Gratuit</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ event: any }>();
</script>
