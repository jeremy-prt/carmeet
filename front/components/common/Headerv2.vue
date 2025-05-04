<template>
  <header class="bg-black text-white py-4 relative z-50">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Logo -->
      <a href="/" class="text-2xl font-bold">
        <Logo class="h-8 w-auto overflow-visible" />
      </a>

      <!-- Navigation -->
      <nav class="flex space-x-6">
        <a
          href="/"
          class="relative group text-white hover:text-primary-hover duration-300"
        >
          Accueil
          <span
            class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-primary-hover transition-all duration-300 group-hover:left-0 group-hover:w-full"
          ></span>
        </a>
        <a
          href="/about"
          class="relative group text-white hover:text-primary-hover duration-300"
        >
          Événements
          <span
            class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-primary-hover transition-all duration-300 group-hover:left-0 group-hover:w-full"
          ></span>
        </a>
        <a
          href="/boutique"
          class="relative group text-white hover:text-primary-hover duration-300"
        >
          Boutique
          <span
            class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-primary-hover transition-all duration-300 group-hover:left-0 group-hover:w-full"
          ></span>
        </a>
        <a
          href="/contact"
          class="relative group text-white hover:text-primary-hover duration-300"
        >
          Contact
          <span
            class="absolute left-1/2 bottom-0 h-[2px] w-0 bg-primary-hover transition-all duration-300 group-hover:left-0 group-hover:w-full"
          ></span>
        </a>
      </nav>

      <!-- Zone utilisateur -->
      <div class="flex items-center gap-5 relative" ref="menuRef">
        <!-- Si utilisateur non connecté -->
        <template v-if="!user">
          <span class="w-14"></span>
          <a
            href="/login"
            class="bg-primary font-medium text-center text-white px-4 py-2 rounded-lg hover:bg-primary-hover duration-300"
          >
            Se connecter
          </a>
        </template>

        <!-- Si utilisateur connecté -->
        <template v-else>
          <span class="w-14"></span>
          <button
            @click="toggleDropdown"
            class="bg-primary cursor-pointer text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-hover duration-300"
          >
            Mon compte
          </button>

          <!-- Dropdown -->
          <div
            v-if="dropdownOpen"
            class="absolute right-0 top-full mt-2 bg-white text-black shadow-lg rounded p-2 w-40"
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
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import Logo from "~/components/common/logo.vue";

const { user, logout } = useAuth();
const dropdownOpen = ref(false);
const menuRef = ref(null);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
