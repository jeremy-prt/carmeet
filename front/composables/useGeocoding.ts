export function useGeocoding() {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.carmeetApiUrl;

  const coordinates = ref<{ lat: number; lng: number } | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const geocodeAddress = async (address: string) => {
    if (!address.trim()) {
      error.value = "Adresse non spécifiée";
      return null;
    }

    loading.value = true;
    error.value = null;
    coordinates.value = null;

    try {
      const response = await fetch(
        `${API_BASE_URL}/autocomplete/geocode?address=${encodeURIComponent(
          address
        )}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors du géocodage");
      }

      const data = await response.json();
      coordinates.value = data;
      return data;
    } catch (e: any) {
      error.value = e.message || "Erreur lors du géocodage";
      console.error("Erreur lors du géocodage de l'adresse:", e);
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    coordinates,
    loading,
    error,
    geocodeAddress,
  };
}
