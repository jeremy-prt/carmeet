import type { Event } from "@/types/event";

export const getEvents = async (): Promise<Event[]> => {
  const config = useRuntimeConfig();

  return await $fetch<Event[]>(`${config.public.apiBaseUrl}/event/`);
};
