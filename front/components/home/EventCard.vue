<template>
  <div
    class="flex-shrink-0 w-80 bg-black border border-gray-700 rounded-xl shadow-md overflow-hidden transition hover:shadow-red-500/30 hover:border-red-500"
  >
    <div class="p-4 flex flex-col justify-between h-full">
      <div>
        <h2 class="text-lg font-semibold text-white mb-2 line-clamp-1">
          {{ event.name }}
        </h2>
        <p class="text-sm text-gray-400 mb-4 line-clamp-2">
          {{ event.description }}
        </p>
      </div>

      <div class="text-sm text-gray-300 space-y-1">
        <p class="line-clamp-1">📍 {{ event.city }} - {{ event.address }}</p>
        <p>
          📅 {{ formatDate(event.event_date) }} à
          {{ formatTime(event.event_time) }}
        </p>
        <p class="text-primary font-semibold">{{ event.price }} €</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "@/types/event";

const props = defineProps<{
  event: Event;
}>();

const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR");
};

const formatTime = (time: string): string => {
  return time.slice(0, 5);
};
</script>
