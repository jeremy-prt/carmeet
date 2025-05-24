<template>
  <section class="w-full flex flex-col items-center text-center py-12">
    <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
      Découvrez les <span class="text-main">événements</span> automobiles
    </h1>
    <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl">
      Participez aux meilleurs événements automobiles près de chez vous
    </p>
    <div ref="inputWrapper" class="relative w-full max-w-xl">
      <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          >
            <path
              d="M12.56 20.82a.96.96 0 0 1-1.12 0C6.611 17.378 1.486 10.298 6.667 5.182A7.6 7.6 0 0 1 12 3c2 0 3.919.785 5.333 2.181c5.181 5.116.056 12.196-4.773 15.64"
            />
            <path d="M12 12a2 2 0 1 0 0-4a2 2 0 0 0 0 4" />
          </g>
        </svg>
      </div>
      <input
        v-model="query"
        type="text"
        style="transition: box-shadow 0.3s"
        :class="[
          'bg-main/5 outline-none text-white placeholder-gray-400 w-full ring-1 ring-main/80 focus:ring-main focus:ring-[1.5px] pl-12 pr-12 py-3 text-sm',
          showPopup && (results.length > 0 || error)
            ? 'rounded-t-xl'
            : 'rounded-xl',
        ]"
        placeholder="Rechercher une ville, un code postal ou une adresse..."
        autocomplete="off"
        @focus="showPopup = true"
        @keydown.enter.prevent="handleEnter"
      />
      <div
        v-if="query.length > 0"
        class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer z-30"
        @click="clearQuery"
      >
        <svg
          class="w-5 h-5 text-gray-400 hover:text-gray-500 transition"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div v-if="loading" class="absolute right-12 top-1/2 -translate-y-1/2">
        <LoaderSpinner />
      </div>
      <div
        v-if="showPopup && (results.length > 0 || error)"
        class="absolute left-[-1.5px] right-[-1.5px] z-20 pt-2 bg-main/10 border-[1.5px] border-t-0 border-main/80 text-left overflow-hidden"
      >
        <ul v-if="results.length > 0">
          <li
            v-for="address in results"
            :key="address.place_id"
            class="px-4 py-3 hover:bg-main/50 cursor-pointer text-white text-sm"
            @click="selectAddress(address.description)"
          >
            {{ address.description }}
          </li>
        </ul>
        <div v-if="error" class="px-4 py-3 text-red-600 text-base">
          {{ error }}
        </div>
      </div>
    </div>

    <!-- Popup Map -->
    <transition name="fade">
      <button
        v-if="showArrow"
        @click="closeMapPopup"
        class="fixed left-1/2 -translate-x-1/2 z-150 bg-main text-white rounded-full shadow-lg flex items-center justify-center w-12 h-12 cursor-pointer hover:text-white transition"
        style="
          top: calc(10vh - 24px);
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
        v-if="showMapPopup"
        class="fixed bottom-0 z-100 left-0 right-0 bg-black/30 shadow-2xl p-8 rounded-t-3xl transform origin-bottom h-[90vh] flex flex-col justify-start overflow-hidden backdrop-blur-3xl border-t border-main"
      >
        <!-- Déco SVGs -->
        <img
          src="/svg/bg-red.svg"
          alt=""
          class="absolute -top-1/4 scale-300 -left-1/4 w-[800px] h-[800px] opacity-40 pointer-events-none select-none"
        />
        <img
          src="/svg/bg-red.svg"
          alt=""
          class="absolute -bottom-1/4 scale-200 -right-1/4 w-[800px] h-[800px] opacity-40 pointer-events-none select-none"
        />
        <img
          src="/svg/bg-red.svg"
          alt=""
          class="absolute -top-1/4 scale-200 right-20 w-[800px] rotate-120 h-[400px] opacity-50 pointer-events-none select-none"
        />

        <div class="flex justify-between items-center mb-8">
          <h2
            class="text-2xl font-semibold text-white tracking-tight drop-shadow-lg"
          >
            <span class="text-main">Filtrer</span> votre recherche
          </h2>
        </div>
        <div class="flex gap-10 flex-1 min-h-0">
          <!-- Colonne filtres -->
          <div
            class="w-1/4 min-w-[250px] max-w-xs bg-main/10 ring-1 ring-main/80 rounded-xl p-6 flex flex-col gap-5 shadow-xl transition duration-300"
          >
            <div class="relative">
              <input
                type="text"
                v-model="selectedAddress"
                placeholder="Rechercher une adresse..."
                class="bg-main/30 outline-none text-white placeholder-gray-400 w-full ring-1 ring-main/80 focus:ring-main focus:ring-[1.5px] px-4 py-3 text-sm duration-300 rounded-lg"
                @keydown.enter.prevent="handleFilterAddressSearch"
              />
              <button
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                @click="handleFilterAddressSearch"
                aria-label="Rechercher cette adresse"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <input
              type="date"
              class="bg-main/30 outline-none text-white placeholder-gray-400 w-full ring-1 ring-main/80 focus:ring-main focus:ring-[1.5px] px-4 py-3 text-sm duration-300 rounded-lg"
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
              ref="mapBoxRef"
              :events="events"
              :selected-address="selectedAddress"
              :initial-coordinates="addressCoordinates"
              @select-event="handleEventSelect"
              class="rounded-2xl ring- shadow-xl transition duration-300"
              style="height: 100%"
            />
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useAddressSearch } from "~/composables/useAddressSearch";
import { useGeocoding } from "~/composables/useGeocoding";
import LoaderSpinner from "~/components/LoaderSpinner.vue";
import MapBox from "~/components/MapBox.vue";
import { useEvents } from "~/composables/useEvents";

const { query, results, loading, error } = useAddressSearch();
const {
  geocodeAddress,
  coordinates: addressCoordinates,
  loading: geocodingLoading,
} = useGeocoding();
const showPopup = ref(false);
const inputWrapper = ref<HTMLElement | null>(null);

// Pour le popup Map
const showMapPopup = ref(false);
const showMap = ref(false);
const showLoader = ref(false);
const showArrow = ref(false);
const selectedAddress = ref("");

// Ajout d'une référence pour le composant MapBox
const mapBoxRef = ref(null);

const {
  events,
  loading: loadingEvents,
  error: errorEvents,
  fetchEvents,
} = useEvents();

function clearQuery() {
  query.value = "";
  showPopup.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (
    inputWrapper.value &&
    !inputWrapper.value.contains(event.target as Node)
  ) {
    showPopup.value = false;
  }
}

// Fonction pour gérer la recherche d'adresse dans les filtres
async function handleFilterAddressSearch() {
  if (selectedAddress.value.trim() !== "") {
    // Afficher un indicateur de chargement si nécessaire, mais sans cacher la carte
    const loaderState = ref(true);

    // Géocoder la nouvelle adresse avec le type de lieu approprié
    const geocodingResult = await geocodeAddress(selectedAddress.value);

    // Si nous avons des coordonnées et que le composant MapBox est accessible
    if (geocodingResult && mapBoxRef.value && mapBoxRef.value.flyTo) {
      // Déterminer le niveau de zoom en fonction de l'adresse
      const zoom = determineZoomLevel(selectedAddress.value);

      // Utiliser la méthode flyTo du composant MapBox
      mapBoxRef.value.flyTo(geocodingResult, zoom);
    } else if (mapBoxRef.value && mapBoxRef.value.searchAddress) {
      // Alternative: utiliser searchAddress si disponible
      await mapBoxRef.value.searchAddress(selectedAddress.value);
    } else {
      console.error(
        "Référence à MapBox non disponible ou méthodes nécessaires non exposées"
      );
    }

    loaderState.value = false;
  }
}

// Fonction pour déterminer le niveau de zoom en fonction du type d'adresse
function determineZoomLevel(address: string) {
  const lowerAddress = address.toLowerCase();

  // Pays
  if (
    /^(france|allemagne|espagne|italie|royaume-uni|usa|états-unis)$/i.test(
      lowerAddress
    )
  ) {
    return 5;
  }

  // Régions/départements français
  if (
    /ile-de-france|bretagne|normandie|aquitaine|occitanie/i.test(lowerAddress)
  ) {
    return 7;
  }

  // Villes (adresse sans rue/avenue/boulevard et avec un seul élément)
  if (
    lowerAddress.split(",").length <= 1 &&
    !lowerAddress.includes("rue") &&
    !lowerAddress.includes("avenue") &&
    !lowerAddress.includes("boulevard")
  ) {
    return 10;
  }

  // Adresse précise
  return 14;
}

// La recherche initiale quand on sélectionne une adresse depuis l'autocomplete
async function selectAddress(address: string) {
  selectedAddress.value = address;
  showMapPopup.value = true;
  showMap.value = false;
  showLoader.value = true;
  showArrow.value = false;

  // Géocoder l'adresse pour obtenir les coordonnées
  await geocodeAddress(address);
}

function handleEnter() {
  if (query.value.trim().length > 0) {
    selectAddress(query.value.trim());
  }
}

function closeMapPopup() {
  showMapPopup.value = false;
  showMap.value = false;
  showArrow.value = false;
}

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

function handleEventSelect(event: any) {
  // Ici tu peux faire ce que tu veux avec l'événement sélectionné sur la map
  // console.log("Événement sélectionné:", event);
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  fetchEvents();
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
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
</style>
