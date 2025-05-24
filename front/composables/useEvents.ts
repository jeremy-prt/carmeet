import { ref } from "vue";
import type { Event } from "~/types/event";
import { useRuntimeConfig } from "#app";

export function useEvents() {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.carmeetApiUrl;

  const events = ref<Event[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchEvents = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${API_BASE_URL}/event`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      }
      const data: Event[] = await response.json();
      events.value = data;
    } catch (e: any) {
      error.value = e.message;
      console.error("Erreur lors de la récupération des événements:", e);
    } finally {
      loading.value = false;
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
  };
}
