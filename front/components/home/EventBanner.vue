<template>
  <div
    ref="banner"
    v-if="event"
    class="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-10 p-6 shadow-lg bg-white rounded-lg w-3/4"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-gray-800">
        {{ event.name }}
      </h3>
      <button
        @click="viewMoreDetails"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Plus de détails
      </button>
    </div>
    <p class="text-gray-600">{{ event.city }}</p>
    <p class="text-gray-600">{{ event.event_date }}</p>
    <p class="text-gray-600">{{ event.price }} €</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Event } from "@/types/event";

const props = defineProps<{
  event: Event | null;
}>();

const emit = defineEmits<{
  (e: "viewMoreDetails", event: Event): void;
}>();

const banner = ref<HTMLDivElement | null>(null);

const viewMoreDetails = () => {
  if (props.event) {
    emit("viewMoreDetails", props.event);
  }
};

defineExpose({ banner });
</script>
