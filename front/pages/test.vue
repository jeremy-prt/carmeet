<template>
  <div class="flex gap-2 justify-center mt-20 min-h-[48px]">
    <input
      type="text"
      class="flex-1 bg-main/5 text-white placeholder-gray-400 ring-1 ring-main/80 focus:ring-main focus:ring-[1.5px] px-4 py-2 rounded-lg outline-none w-full"
      placeholder="Rechercher..."
    />
    <button
      @click="showPopup = !showPopup"
      class="bg-main hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow duration-300"
    >
      Rechercher
    </button>
  </div>

  <!-- Bouton de fermeture flottant, hors du popup -->
  <transition name="fade">
    <button
      v-if="showArrow"
      @click="showPopup = false"
      class="fixed left-1/2 -translate-x-1/2 z-50 bg-black text-main rounded-full shadow-lg flex items-center justify-center w-12 h-12 border-4 border-main/80"
      style="
        top: calc(20vh - 24px);
        box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.15);
      "
      aria-label="Fermer le popup"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 15 15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27"
        />
      </svg>
    </button>
  </transition>

  <Transition
    name="slide-up"
    @after-enter="startLoader()"
    @before-leave="
      showMap = false;
      showArrow = false;
    "
  >
    <div
      v-if="showPopup"
      class="fixed bottom-0 left-0 right-0 bg-main/95 p-8 rounded-t-2xl transform origin-bottom h-[80vh] flex flex-col justify-start"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-white text-2xl font-semibold">
          Résultats de recherche
        </h2>
      </div>
      <div class="flex gap-8 flex-1 min-h-0">
        <!-- Colonne filtres -->
        <div
          class="w-1/4 min-w-[220px] max-w-xs bg-main/80 rounded-lg p-4 flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Filtrer par nom..."
            class="px-3 py-2 rounded bg-white/10 text-white placeholder-gray-300 outline-none"
          />
          <input
            type="date"
            class="px-3 py-2 rounded bg-white/10 text-white placeholder-gray-300 outline-none"
          />
        </div>
        <!-- Colonne carte -->
        <div class="w-3/4 flex items-center justify-center min-h-0">
          <div
            v-if="showLoader"
            class="flex-1 flex items-center justify-center h-full"
          >
            <svg
              class="animate-spin h-32 w-32 text-white opacity-80"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
          <MapBox
            v-if="showMap && !showLoader"
            :events="events"
            :selected-address="selectedAddress"
            @select-event="handleEventSelect"
            style="height: 100%"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MapBox from "~/components/MapBox.vue";

const showPopup = ref(false);
const showMap = ref(false);
const showLoader = ref(false);
const showArrow = ref(false);
const selectedAddress = ref("");
const events = ref([
  {
    id: 1,
    name: "Événement 1",
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    id: 2,
    name: "Événement 2",
    latitude: 45.764,
    longitude: 4.8357,
  },
]);

const handleEventSelect = (event: any) => {
  console.log("Événement sélectionné:", event);
};

function startLoader() {
  showLoader.value = true;
  showArrow.value = false;
  setTimeout(() => {
    showLoader.value = false;
    showMap.value = true;
    setTimeout(() => {
      showArrow.value = true;
    }, 30);
  }, 200);
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
  transform-origin: bottom;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: scaleY(0);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: scaleY(1);
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
