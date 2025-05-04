// services/qrcodeService.ts
import { getToken } from "@/composables/getToken";
import type { QrCode } from "@/types/qrcode";

export const getMyQRCode = async (): Promise<QrCode | null> => {
  const config = useRuntimeConfig();
  const token = getToken();

  if (!token) throw new Error("Utilisateur non authentifié");

  try {
    return await $fetch<QrCode>(`${config.public.apiBaseUrl}/qrcode/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (error.status === 404) return null;
    throw error;
  }
};

export const createQRCode = async (payload: {
  qrcode_data: string;
  size: string;
  color: string;
  bgcolor: string;
  ecc: string;
  margin: string;
}): Promise<QrCode> => {
  const config = useRuntimeConfig();
  const token = getToken();

  if (!token) throw new Error("Utilisateur non authentifié");

  return await $fetch<QrCode>(`${config.public.apiBaseUrl}/qrcode/create`, {
    method: "POST",
    body: payload,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteQRCode = async (): Promise<void> => {
  const config = useRuntimeConfig();
  const token = getToken();
  if (!token) throw new Error("Utilisateur non authentifié");

  await $fetch(`${config.public.apiBaseUrl}/qrcode/delete`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
