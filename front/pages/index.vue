<template>
  <div class="bg-black">
    <div class="container mx-auto py-8">
      <h1 class="text-4xl font-bold text-center text-white mb-8">
        Événements en vedette (test action)
      </h1>

      <!-- Carrousel des cartes d'événements mis en avant -->
      <EventCarousel :events="featuredEvents" />

      <!-- Message si aucun événement mis en avant -->
      <div
        v-if="featuredEvents.length === 0 && !isLoading"
        class="text-center text-gray-600 mt-8"
      >
        Aucun événement disponible.
      </div>

      <!-- Message de chargement -->
      <div v-if="isLoading" class="text-center text-gray-500 mt-6">
        Chargement des événements...
      </div>

      <!-- Barre de recherche d'adresse -->
      <SearchBar @addressSelected="updateAddress" class="mt-8" />

      <!-- Carte des événements avec Mapbox -->
      <ClientOnly>
        <MapEvent
          :selectedAddress="selectedAddress"
          :events="events"
          class="mt-9"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAsyncData } from "#app";
import { getEvents } from "@/services/eventService";
import type { Event } from "@/types/event";

import SearchBar from "@/components/home/SearchBar.vue";
import EventCarousel from "@/components/home/EventCarousel.vue";
import MapEvent from "@/components/home/MapEvent.vue";
import { useSwiperAutoplay } from "@/composables/useSwiperAutoplay";

// Gestion du carrousel (autoplay, pause, barre de progression)
const {
  onSwiperInit,
  pauseAutoplay,
  resumeAutoplay,
  onAutoplayTimeLeft,
  progressBar,
} = useSwiperAutoplay();

// Adresse sélectionnée depuis la barre de recherche
const selectedAddress = ref("");

// Récupération des événements via useAsyncData (avec SSR)
const {
  data,
  pending: isLoading,
  error,
} = await useAsyncData("events", () => getEvents());

// Référence des événements chargés
const events = ref<Event[]>(data.value || []);

// Filtrer les événements mis en avant
const featuredEvents = computed(() =>
  events.value.filter((event) => event.is_featured)
);

// Mise à jour de l’adresse depuis la SearchBar
const updateAddress = (address: string) => {
  selectedAddress.value = address;
};
</script>

<style scoped>
.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.autoplay-small-bar {
  width: 100px;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 0.1s linear;
}
</style>
