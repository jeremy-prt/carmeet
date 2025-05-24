<template>
  <div
    ref="mapContainer"
    class="mapbox-container w-full rounded-lg"
    :style="{ height: '70vh' }"
  ></div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  defineExpose,
} from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Map } from "mapbox-gl";

// Utiliser le composable de géocodage
const { geocodeAddress, coordinates, loading: geocodeLoading } = useGeocoding();

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  selectedAddress: {
    type: String,
    default: "",
  },
  initialCoordinates: {
    type: Object,
    default: null,
  },
});

// Référence à l'objet map (MapboxGL ou autre bibliothèque que vous utilisez)
const map = ref<null | mapboxgl.Map>(null);

const emit = defineEmits<{
  (e: "selectEvent", event: any): void;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let ignoreNextClick = false;

const { events, loading, error, fetchEvents } = useEvents();

// Initialisation de la carte
const initializeMap = async () => {
  const config = useRuntimeConfig();
  mapboxgl.accessToken = config.public.mapboxToken;

  if (!mapContainer.value) return;

  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: "mapbox://styles/jeremyy-prt/cm62xlodg002m01sig8nd74nj",
    center: [2.3522, 48.8566], // Centre par défaut : Paris
    zoom: 5,
  });

  if (props.events?.length) {
    addMarkers(map.value, props.events);
  }

  // Forcer le resize après le rendu pour corriger la taille du canvas
  await nextTick();
  map.value.resize();
};

// Méthode exposée pour forcer le resize depuis le parent
const forceResize = async () => {
  await nextTick();
  if (map.value) map.value.resize();
};

// Fonction pour déplacer la carte vers de nouvelles coordonnées
function flyTo(coordinates, customZoom = null) {
  if (!map.value || !coordinates) return;

  // Utilise le zoom fourni ou un niveau par défaut
  const zoom = customZoom || 11;

  // Déplace la carte vers les nouvelles coordonnées avec une animation fluide
  map.value.flyTo({
    center: Array.isArray(coordinates)
      ? coordinates // Si coordinates est déjà un tableau [lng, lat]
      : [coordinates.lng, coordinates.lat], // Si coordinates est un objet {lng, lat}
    zoom: zoom,
    essential: true, // Animation en douceur
    duration: 2000,
  });
}

// Ajouter une méthode pour déclencher explicitement la recherche d'adresse
const searchAddress = async (address: string) => {
  if (address && map.value) {
    // Utiliser la fonction geocodeAddress du composable
    const result = await geocodeAddress(address);

    if (result) {
      // Déterminer le niveau de zoom approprié
      const zoom = determineZoomLevel(address);

      // Utiliser la méthode flyTo pour déplacer la carte
      flyTo([result.lng, result.lat], zoom);

      return {
        center: [result.lng, result.lat],
        zoom: zoom,
        originalData: result,
      };
    }
  }
  return null;
};

// Ajout des marqueurs
const addMarkers = (map: mapboxgl.Map, events: any[]) => {
  events.forEach((event) => {
    // Crée un élément DOM pour le marqueur
    const el = document.createElement("div");
    el.className = "marker";

    // Détermine quel SVG utiliser en fonction du prix
    const markerSvg =
      event.price > 0.0
        ? "/assets/marqer_no_free.svg"
        : "/assets/marker_free.svg";

    // Ajoute l'image SVG à l'élément DOM
    el.innerHTML = `<img src="${markerSvg}" alt="marker" style="width: 25px; height: auto;">`;

    const marker = new mapboxgl.Marker({
      element: el, // Utilise l'élément DOM personnalisé
      anchor: "bottom", // Ancre le marqueur au bas de l'icône
    })
      .setLngLat([event.longitude, event.latitude])
      .addTo(map);

    // Formatage de la date pour l'affichage
    const formattedDate = new Date(event.event_date)
      .toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");

    // Crée et associe un popup au style similaire à l'image fournie
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      maxWidth: "320px", // Un peu plus large pour un meilleur rendu
      className: "custom-popup",
    }).setHTML(`
      <div class="event-popup">
        <h2 class="event-title">${event.name}</h2>
        <p class="event-location">${event.address}, ${event.city}</p>
        <p class="event-date">${formattedDate}</p>
        <div class="event-price-display">
          <strong>${event.price > 0 ? event.price + "€" : "Gratuit"}</strong>
        </div>
        <a href="/evenement/${event.id_event}" class="view-event-btn">
          Voir l'événement
        </a>
      </div>
    `);

    // Associe le popup au marqueur
    marker.setPopup(popup);

    // Gérer la fermeture du popup avec le bouton personnalisé
    marker.getElement().addEventListener("click", () => {
      setTimeout(() => {
        const closeButtons = document.querySelectorAll(".close-button");
        closeButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            e.stopPropagation();
            marker.togglePopup();
          });
        });
      }, 10);
    });
  });
};

// Fonction pour estimer le niveau de zoom en fonction de l'adresse
const determineZoomLevel = (address: string) => {
  // Règles simples basées sur le texte de l'adresse pour estimer le type de lieu
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

  // Villes
  if (
    lowerAddress.split(",").length <= 1 &&
    !lowerAddress.includes("rue") &&
    !lowerAddress.includes("avenue") &&
    !lowerAddress.includes("boulevard")
  ) {
    return 9;
  }

  // Adresse précise
  return 12;
};

// Initialisation au montage
onMounted(() => {
  initializeMap();
  fetchEvents(); // Charge les événements au montage

  // À l'initialisation de la carte, si des coordonnées initiales sont fournies,
  // centrer la carte sur ces coordonnées avec un zoom personnalisé
  if (props.initialCoordinates && props.selectedAddress) {
    // Déterminer le niveau de zoom approprié en fonction de l'adresse sélectionnée
    const zoom = determineZoomLevel(props.selectedAddress);

    // Centrer la carte sur les coordonnées fournies avec le zoom personnalisé
    if (map.value) {
      map.value.flyTo({
        center: [props.initialCoordinates.lng, props.initialCoordinates.lat],
        zoom: zoom,
        essential: true,
        duration: 2000,
      });
    }
  } else if (props.initialCoordinates) {
    // Si on a des coordonnées mais pas d'adresse, utiliser un zoom par défaut
    if (map.value) {
      map.value.flyTo({
        center: [props.initialCoordinates.lng, props.initialCoordinates.lat],
        zoom: 12,
        essential: true,
        duration: 2000,
      });
    }
  }
});

// Nettoyage au démontage
onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});

// Surveillance des changements d'événements
watch(events, (newEvents) => {
  if (map.value && newEvents?.length) {
    addMarkers(map.value, newEvents);
  }
});

// Exposer les méthodes au parent
defineExpose({ forceResize, flyTo, searchAddress });
</script>

<!-- Utiliser deux balises style - une avec scoped pour le composant, une sans scope pour les éléments externes -->
<style scoped>
.mapbox-container {
  min-height: 400px;
  max-height: 85vh;
}
</style>

<!-- Style non scoped pour cibler les éléments Mapbox qui sont en dehors du composant -->
<style>
/* Style pour les popups Mapbox */
.mapboxgl-popup.custom-popup {
  z-index: 1000;
}

.mapboxgl-popup.custom-popup .mapboxgl-popup-content {
  padding: 0 !important;
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 300px;
  background-color: white;
  border: none;
}

.mapboxgl-popup.custom-popup .mapboxgl-popup-tip {
  display: none; /* Masquer la flèche du popup */
}

.event-popup {
  padding: 20px;
  text-align: center;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.event-title {
  font-size: 22px;
  font-weight: 700;
  color: #222;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.event-location {
  font-size: 14px;
  color: #555;
  margin: 0 0 5px 0;
}

.event-date {
  font-size: 14px;
  color: #777;
  margin: 0 0 15px 0;
}

.event-price-display {
  font-size: 20px;
  margin: 10px 0 20px 0;
  color: #222;
}

.view-event-btn {
  display: block;
  background-color: #bf282e;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 30px;
  text-decoration: none;
  width: 100%;
  text-align: center;
  transition: all 0.2s ease;
  margin-top: 10px;
  border: none;
  cursor: pointer;
}

.view-event-btn:hover {
  background-color: #e43c40;
  box-shadow: 0 4px 10px rgba(255, 75, 80, 0.3);
}
</style>
