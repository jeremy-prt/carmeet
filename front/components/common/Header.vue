<template>
  <header class="bg-black text-white py-4 relative z-50">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">CarMeet</h1>
      <nav>
        <ul class="flex space-x-4 items-center">
          <li><a href="/" class="hover:underline">Accueil</a></li>
          <li><a href="/events" class="hover:underline">Événements</a></li>

          <!-- Si l'utilisateur n'est pas connecté -->
          <li v-if="!user">
            <a href="/login" class="hover:underline">Login</a>
          </li>

          <!-- Si l'utilisateur est connecté -->
          <li v-if="user" class="relative" ref="menuRef">
            <button
              @click="toggleDropdown"
              class="bg-white cursor-pointer text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Mon compte
            </button>

            <!-- Dropdown -->
            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 bg-white text-black shadow-lg rounded p-2 w-40"
            >
              <a
                href="/mon-espace/qrcode"
                class="block px-2 py-1 hover:bg-gray-100 rounded"
              >
                QR Code
              </a>
              <button
                @click="logout"
                class="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-red-500"
              >
                Se déconnecter
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "@/composables/useAuth";

const { user, logout } = useAuth();
const dropdownOpen = ref(false);

// Référence pour le menu dropdown
const menuRef = ref(null);

// Ouvrir/fermer le dropdown
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Fermer le dropdown si clic en dehors
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

// Ajouter et retirer l'écouteur d'événements
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
