<template>
  <div
    v-if="isInitialized"
    class="flex items-center justify-center"
    :style="{ minHeight: `calc(100vh - ${headerHeight}px)` }"
  >
    <div class="p-4 max-w-sm bg-white shadow-md rounded">
      <h1 class="text-2xl font-bold mb-6 text-center">Mon QR Code</h1>

      <!-- Message d'erreur -->
      <p v-if="errorMessage" class="text-red-500 text-sm mb-4 text-center">
        {{ errorMessage }}
      </p>

      <!-- Chargement -->
      <div v-if="isLoading" class="text-center text-gray-500">
        <div
          class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"
        ></div>
        Traitement en cours...
      </div>

      <!-- QR Code affiché -->
      <div v-else-if="qrcode">
        <div
          v-if="qrcode.qrcode_image_url && !imageError && imageReady"
          class="mb-4 w-full max-w-sm mx-auto overflow-hidden animate-fade-in-scale"
        >
          <img
            :src="qrcode.qrcode_image_url"
            alt="QR Code"
            class="w-auto h-40 mx-auto"
            ref="qrImage"
            @error="imageError = true"
          />
        </div>

        <!-- Image cachée pour attendre qu'elle soit chargée -->
        <img
          v-if="qrcode.qrcode_image_url && !imageReady"
          :src="qrcode.qrcode_image_url"
          class="hidden"
          @load="onImageLoad"
        />

        <p v-if="imageError" class="text-red-500 text-sm mb-2 text-center">
          Erreur lors du chargement de l’image du QR Code.
        </p>

        <p
          v-if="qrcode.createdAt"
          class="text-sm text-gray-600 mb-2 text-center"
        >
          Généré le : {{ formatDate(qrcode.createdAt) }}
        </p>

        <div class="flex justify-center flex-wrap gap-2 mt-4">
          <button
            @click="handleDownload"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Télécharger
          </button>

          <button
            @click="handleDelete"
            :disabled="isLoading"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
          >
            Supprimer
          </button>
        </div>
      </div>

      <!-- Formulaire de création -->
      <div v-else>
        <form @submit.prevent="handleCreate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">URL à encoder</label>
            <input
              v-model="form.qrcode_data"
              type="text"
              placeholder="https://example.com"
              required
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">Couleur</label>
              <select
                v-model="form.color"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="000000">Noir</option>
                <option value="FF0000">Rouge</option>
                <option value="0066FF">Bleu</option>
                <option value="00AA00">Vert</option>
                <option value="FF9900">Orange</option>
                <option value="800080">Violet</option>
              </select>
            </div>

            <div class="flex-1">
              <label class="block text-sm font-medium mb-1">Fond</label>
              <select
                v-model="form.bgcolor"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FFFFFF">Blanc</option>
                <option value="FFFFCC">Jaune clair</option>
                <option value="EEEEEE">Gris clair</option>
                <option value="CCE5FF">Bleu pâle</option>
                <option value="F5F5DC">Beige</option>
                <option value="000000">Noir</option>
              </select>
            </div>
          </div>

          <div class="text-center">
            <button
              type="submit"
              :disabled="isLoading"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              Créer mon QR Code
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQRCode } from "@/composables/useQrCode";

const {
  qrcode,
  isLoading,
  imageError,
  errorMessage,
  form,
  loadQRCode,
  handleDelete,
  handleCreate,
  formatDate,
} = useQRCode();

definePageMeta({
  middleware: "auth",
});

const isInitialized = ref(false);
const imageReady = ref(false);
const qrImage = ref<HTMLImageElement | null>(null);

const onImageLoad = () => {
  imageReady.value = true;
};

const handleDownload = () => {
  if (!qrImage.value || !qrcode.value) return;

  const link = document.createElement("a");
  link.href = qrImage.value.src;
  link.download = "mon-qr-code.png";
  link.click();
};

const headerHeight = ref(0);

onMounted(() => {
  const header = document.querySelector("header");
  if (header) {
    headerHeight.value = header.offsetHeight;
  }
});

// Forcer les valeurs fixes
form.value.size = "500x500";
form.value.ecc = "H";
form.value.margin = "4";

onMounted(async () => {
  await loadQRCode();
  isInitialized.value = true;
});
</script>

<style scoped>
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-scale {
  animation: fadeInScale 0.4s ease-out;
}
</style>
