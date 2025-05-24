export function useAddressSearch() {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.carmeetApiUrl;

  const query = ref("");
  const results = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function searchAddress(input: string) {
    if (!input) {
      results.value = [];
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(
        `${API_BASE_URL}/autocomplete/address?input=${encodeURIComponent(
          input
        )}`
      );
      if (!res.ok)
        throw new Error("Erreur lors de la récupération des adresses");
      const data = await res.json();
      results.value = data.slice(0, 3);
    } catch (e: any) {
      error.value = e.message || "Erreur inconnue";
      results.value = [];
    } finally {
      loading.value = false;
    }
  }

  watch(query, (val) => {
    if (val && val.length > 3) {
      searchAddress(val);
    } else {
      results.value = [];
    }
  });

  return { query, results, loading, error };
}
