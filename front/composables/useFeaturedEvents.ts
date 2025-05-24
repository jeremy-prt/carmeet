import { ref } from "vue";
import type { Event } from "~/types/event";

export function useFeaturedEvents() {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.carmeetApiUrl;

  const events = ref<Event[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function shuffle(array: Event[]) {
    // Durstenfeld shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function fetchFeaturedEvents() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_BASE_URL}/event`);
      if (!res.ok)
        throw new Error("Erreur lors de la récupération des événements");
      const allEvents: Event[] = await res.json();
      const featured = allEvents.filter((e) => e.is_featured);
      events.value = shuffle(featured);
    } catch (e: any) {
      error.value = e.message || "Erreur inconnue";
      events.value = [];
    } finally {
      loading.value = false;
    }
  }

  return { events, loading, error, fetchFeaturedEvents };
}
