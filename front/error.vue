<script setup lang="ts">
import type { NuxtError } from "#app";

// Typage des props pour l'erreur Nuxt
const props = defineProps<{
  error: NuxtError;
}>();

// Fonction pour rediriger vers la page d'accueil après avoir nettoyé l'erreur
const handleError = () => {
  clearError({ redirect: "/" });
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4"
  >
    <div class="max-w-md">
      <!-- Affichage du code d'erreur -->
      <h1 class="text-7xl font-bold text-red-600 mb-4">
        {{ error.statusCode || "Erreur" }}
      </h1>

      <!-- Gestion personnalisée des messages d'erreurs -->
      <p class="text-xl mb-6 text-gray-700">
        <!-- Message spécifique pour 404 -->
        <template v-if="error.statusCode === 404">
          Oups ! La page que vous recherchez n'existe pas.
        </template>

        <!-- Message générique pour les autres erreurs -->
        <template v-else>
          Une erreur est survenue : {{ error.message }}
        </template>
      </p>

      <!-- Bouton de retour à l'accueil -->
      <button
        @click="handleError"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Retour à l'accueil
      </button>
    </div>
  </div>
</template>
