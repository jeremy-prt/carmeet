<template>
  <div class="relative">
    <div
      ref="mapContainer"
      class="w-full h-[500px] rounded-xl shadow-md overflow-hidden border border-gray-800"
    ></div>
    <EventBanner
      ref="eventBanner"
      :event="selectedEvent"
      @viewMoreDetails="viewMoreDetails"
    />
  </div>
</template>

<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { ref, onMounted, watch, onUnmounted } from "vue";
import { useRuntimeConfig } from "#imports";
import { geocodeAddress } from "@/services/addressService";
import { addMarkers } from "@/services/markerService";
import EventBanner from "@/components/home/EventBanner.vue";
import type { Event } from "@/types/event";

// Définition des props
const props = defineProps<{
  selectedAddress: string;
  events: Array<Event>;
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
let map: mapboxgl.Map | null = null;
const eventBanner = ref<InstanceType<typeof EventBanner> | null>(null);
const config = useRuntimeConfig();
const selectedEvent = ref<Event | null>(null);
let ignoreNextClick = false;

// Initialisation de la carte
const initializeMap = () => {
  mapboxgl.accessToken = config.public.mapboxToken;

  if (!mapContainer.value) return;

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/jeremyy-prt/cm62xlodg002m01sig8nd74nj",
    center: [2.3522, 48.8566], // Centre par défaut : Paris
    zoom: 5,
  });

  addMarkers(map, props.events, (event) => {
    selectedEvent.value = event;
    ignoreNextClick = true;
    setTimeout(() => {
      ignoreNextClick = false;
    }, 300);
  });
};

// Initialisation de la carte au montage
onMounted(() => {
  initializeMap();

  // Ajouter un gestionnaire d'événements global pour les clics en dehors du bandeau
  document.addEventListener("click", closeBanner);
});

// Nettoyer les gestionnaires d'événements lors du démontage
onUnmounted(() => {
  document.removeEventListener("click", closeBanner);
});

// Ajout des marqueurs si la liste d'événements change
watch(
  () => props.events,
  (newEvents) => {
    if (map && newEvents && newEvents.length > 0) {
      addMarkers(map, newEvents, (event) => {
        selectedEvent.value = event;
        ignoreNextClick = true;
        setTimeout(() => {
          ignoreNextClick = false;
        }, 300);
      });
    }
  },
  { immediate: true }
);

// Recentre la carte lorsque l'adresse sélectionnée change
watch(
  () => props.selectedAddress,
  async (newAddress) => {
    if (newAddress && map) {
      const coords = await geocodeAddress(newAddress);
      map.flyTo({ center: [coords.lng, coords.lat], zoom: 14 });
    }
  }
);

// Fonction pour afficher plus de détails
const viewMoreDetails = (event: Event) => {
  console.log("Afficher plus de détails pour l'événement:", event);
};

// Fonction pour fermer le bandeau
const closeBanner = (event: MouseEvent) => {
  if (ignoreNextClick) {
    ignoreNextClick = false;
    return;
  }

  if (
    eventBanner.value &&
    eventBanner.value.banner &&
    !eventBanner.value.banner.contains(event.target as Node)
  ) {
    selectedEvent.value = null;
  }
};
</script>
