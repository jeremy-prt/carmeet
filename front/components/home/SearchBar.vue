<template>
  <div class="relative w-full max-w-lg mx-auto">
    <input
      type="text"
      v-model="query"
      @input="handleInput"
      @focus="showDropdown = true"
      @blur="hideDropdown"
      placeholder="Rechercher une adresse..."
      class="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500"
    />
    <ul
      v-if="showDropdown && suggestions.length"
      class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @mousedown.prevent="selectSuggestion(suggestion)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ suggestion.description }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { debounce } from "lodash-es";
import { getAddressSuggestions } from "@/services/addressService";

// Émission de l'événement pour notifier le parent
const emits = defineEmits<{
  (e: "addressSelected", address: string): void;
}>();

const query = ref("");
const suggestions = ref<Array<any>>([]);
const showDropdown = ref(false);

// Fonction de debounced call au service d'autocomplétion
const debouncedFetch = debounce(async () => {
  if (query.value.trim().length > 2) {
    suggestions.value = await getAddressSuggestions(query.value);
    showDropdown.value = suggestions.value.length > 0;
  } else {
    suggestions.value = [];
    showDropdown.value = false;
  }
}, 800);

const handleInput = () => {
  debouncedFetch();
};

const hideDropdown = () => {
  // Délai pour permettre le clic sur une suggestion avant de masquer le dropdown
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const selectSuggestion = (suggestion: any) => {
  query.value = suggestion.description;
  showDropdown.value = false;
  emits("addressSelected", suggestion.description);
};
</script>
