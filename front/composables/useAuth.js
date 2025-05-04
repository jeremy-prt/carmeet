import { useCookie } from "#app";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const token = useCookie("token");
  const router = useRouter();

  const user = computed(() => {
    if (!token.value) return null;

    try {
      const decoded = jwtDecode(token.value);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp < now) {
        // Token expiré → suppression et redirection
        token.value = null;

        router.push({ path: "/login", query: { expired: "true" } });
        return null;
      }

      return decoded;
    } catch (err) {
      console.error("Erreur JWT :", err);
      token.value = null;
      return null;
    }
  });

  const logout = () => {
    token.value = null;
    window.location.reload();
  };

  return { user, logout };
}
