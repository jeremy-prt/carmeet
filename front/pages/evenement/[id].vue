<template>
  <div>
    <div class="max-w-3xl mx-auto">
      <!-- Affichage du chargement -->
      <div
        v-if="loading"
        class="bg-gray-800 rounded-xl p-8 shadow-lg animate-pulse"
      >
        <div class="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
        <div class="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-700 rounded w-full"></div>
          <div class="h-4 bg-gray-700 rounded w-5/6"></div>
          <div class="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>

      <!-- Affichage de l'erreur -->
      <div
        v-else-if="error"
        class="bg-red-900/30 border border-red-500 p-6 rounded-xl text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 mx-auto text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 class="text-xl font-bold text-white mb-2">
          Une erreur s'est produite
        </h2>
        <p class="text-gray-300">{{ error }}</p>
        <button
          @click="fetchEventDetails()"
          class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          Réessayer
        </button>
      </div>

      <!-- Affichage de l'événement -->
      <div v-else-if="event">
        <!-- En-tête -->
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
            {{ event.name }}
          </h1>
          <div class="flex items-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ event.address }}, {{ event.city }}
          </div>
        </div>

        <!-- Informations clés -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <!-- Type d'événement -->
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <h3 class="text-gray-400 text-sm mb-1">Type d'événement</h3>
            <p class="text-white font-medium">
              {{ event.event_type || "Non spécifié" }}
            </p>
          </div>

          <!-- Date -->
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <h3 class="text-gray-400 text-sm mb-1">Date</h3>
            <p class="text-white font-medium">
              {{ formatDate(event.event_date) }}
            </p>
          </div>

          <!-- Prix -->
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <h3 class="text-gray-400 text-sm mb-1">Prix</h3>
            <p class="text-white font-medium">
              {{ event.price > 0 ? `${event.price}€` : "Gratuit" }}
            </p>
          </div>

          <!-- Places disponibles -->
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <h3 class="text-gray-400 text-sm mb-1">Places disponibles</h3>
            <p class="text-white font-medium">
              {{ event.available_seats || "Illimité" }}
            </p>
          </div>

          <!-- Catégorie -->
          <div class="bg-gray-900/50 p-4 rounded-lg">
            <h3 class="text-gray-400 text-sm mb-1">Catégorie</h3>
            <p class="text-white font-medium">
              {{ event.category || "Non spécifiée" }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-white mb-3">Description</h2>
          <div class="text-gray-300 bg-gray-900/30 p-4 rounded-lg">
            <p>{{ event.description || "Aucune description disponible." }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useEventDetails } from "~/composables/useEventDetails";

const route = useRoute();
const { event, loading, error, fetchEvent, formatDate, formatTime } =
  useEventDetails();

// Fonction pour récupérer l'ID depuis l'URL et charger les détails
const fetchEventDetails = async () => {
  let eventId = route.params.id;
  if (Array.isArray(eventId)) {
    eventId = eventId[0];
  }
  if (eventId) {
    await fetchEvent(eventId);
  }
};

onMounted(() => {
  fetchEventDetails();
});
</script>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>
