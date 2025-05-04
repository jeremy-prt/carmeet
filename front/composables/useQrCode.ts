import { ref } from "vue";
import {
  getMyQRCode,
  createQRCode,
  deleteQRCode,
} from "@/services/qrcodeService";
import type { QrCode } from "@/types/qrcode";

export function useQRCode() {
  const qrcode = ref<QrCode | null>(null);
  const isLoading = ref(false);
  const imageError = ref(false);
  const errorMessage = ref("");
  const showQRCode = ref(false);
  const justCreated = ref(false);

  const form = ref({
    qrcode_data: "",
    size: "300x300",
    color: "000000",
    bgcolor: "FFFFFF",
    ecc: "L",
    margin: "4",
  });

  // Charger le QR Code existant
  const loadQRCode = async () => {
    try {
      isLoading.value = true;
      qrcode.value = await getMyQRCode();
      showQRCode.value = true;
    } catch (error) {
      errorMessage.value = "Erreur lors du chargement du QR code.";
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  // Supprimer le QR Code
  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer votre QR code ?")) return;

    try {
      isLoading.value = true;
      errorMessage.value = "";
      await deleteQRCode();
      qrcode.value = null;
      showQRCode.value = false;
    } catch (error) {
      errorMessage.value = "Erreur lors de la suppression du QR code.";
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  // Créer un QR Code
  const handleCreate = async () => {
    try {
      isLoading.value = true;
      imageError.value = false;
      errorMessage.value = "";
      showQRCode.value = false;
      justCreated.value = false;

      await createQRCode({ ...form.value });

      // Petite pause visuelle avant d'afficher
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await loadQRCode();
      justCreated.value = true;
    } catch (error) {
      errorMessage.value = "Erreur lors de la création du QR code.";
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  // Formater une date
  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "Date inconnue";
      const corrected = dateStr.replace(" ", "T");
      const date = new Date(corrected);
      if (isNaN(date.getTime())) return "Date invalide";

      return date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Erreur date";
    }
  };

  return {
    qrcode,
    isLoading,
    imageError,
    errorMessage,
    showQRCode,
    form,
    loadQRCode,
    justCreated,
    handleDelete,
    handleCreate,
    formatDate,
  };
}
