import { useRuntimeConfig } from "#app";
import type { Event } from "~/types/event";

export function useEventDetails() {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.carmeetApiUrl;

  const event: Ref<Event | null> = ref(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Récupère les détails d'un événement par son ID
   * @param eventId L'ID de l'événement à récupérer
   */
  const fetchEvent = async (eventId: number | string) => {
    if (!eventId) {
      error.value = "ID d'événement non spécifié";
      return null;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/event/${eventId}`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      event.value = data;
      return data;
    } catch (err: any) {
      console.error(
        "Erreur lors de la récupération des détails de l'événement:",
        err
      );
      error.value = err.message || "Une erreur s'est produite";
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Formate la date de l'événement en format français
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };

    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  /**
   * Formate l'heure de l'événement en format 24h
   */
  const formatTime = (timeString: string): string => {
    if (!timeString) return "";

    // Si le format est déjà HH:MM, on le retourne tel quel
    if (timeString.match(/^\d{1,2}:\d{2}$/)) {
      return timeString;
    }

    // Si c'est un format ISO ou autre, on extrait l'heure
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return timeString;
    }
  };

  return {
    event,
    loading,
    error,
    fetchEvent,
    formatDate,
    formatTime,
  };
}
