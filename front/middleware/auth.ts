import { jwtDecode } from "jwt-decode";

export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("token");

  // Pas de token ? redirection login
  if (!token.value) {
    return navigateTo("/login");
  }

  try {
    const decoded = jwtDecode(token.value);
    const now = Date.now() / 1000;

    if (decoded.exp && decoded.exp < now) {
      // Token expiré : on le supprime et on redirige
      token.value = null;
      return navigateTo({ path: "/login", query: { expired: "true" } });
    }
  } catch (err) {
    console.error("Token invalide :", err);
    token.value = null;
    return navigateTo("/login");
  }
});
