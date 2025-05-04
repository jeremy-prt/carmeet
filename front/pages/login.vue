<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Connexion</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          class="w-full border rounded px-4 py-2"
          required
        />

        <input
          type="password"
          v-model="password"
          placeholder="Mot de passe"
          class="w-full border rounded px-4 py-2"
          required
        />

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>

        <p v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </p>
      </form>

      <p v-if="sessionExpired" class="text-red-600 text-sm text-center mt-4">
        Votre session a expiré. Veuillez vous reconnecter.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "@/services/authService";

const route = useRoute();
const sessionExpired = computed(() => route.query.expired === "true");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await loginUser({
      email: email.value,
      password: password.value,
    });

    const token = useCookie("token");
    token.value = response.token;

    router.push("/");
  } catch (error) {
    errorMessage.value =
      error?.data?.message || "Une erreur est survenue lors de la connexion.";
  }
};
</script>
