// Fonction pour obt// Fonction pour obtenir des suggestions d'adresses
export async function getAddressSuggestions(query: string): Promise<any[]> {
  if (query.trim().length < 3) {
    return [];
  }

  try {
    const config = useRuntimeConfig(); // Récupère la configuration runtime
    const response = await fetch(
      `${
        config.public.apiBaseUrl
      }/autocomplete/address?input=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Erreur réseau lors de la récupération des suggestions.");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error(
      "Erreur lors de l'appel du service d'autocomplétion :",
      error
    );
    return [];
  }
}

/// Fonction pour géocoder une adresse et obtenir ses coordonnées
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number }> {
  if (!address || address.trim().length < 3) {
    return { lat: 2.3522, lng: 48.8566 }; // Paris par défaut
  }

  try {
    const config = useRuntimeConfig(); // Récupère la configuration runtime
    const response = await fetch(
      `${
        config.public.apiBaseUrl
      }/autocomplete/geocode?address=${encodeURIComponent(address)}`
    );

    if (!response.ok) {
      throw new Error("Erreur lors de l'appel au service de géocodage.");
    }

    const data = await response.json();

    if (data && typeof data.lat === "number" && typeof data.lng === "number") {
      return { lat: data.lat, lng: data.lng };
    } else {
      throw new Error("Données de géocodage invalides.");
    }
  } catch (error) {
    console.error("Erreur dans geocodeAddress :", error);
    return { lat: 2.3522, lng: 48.8566 };
  }
}
