export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<{ token: string }> {
  const config = useRuntimeConfig();

  return await $fetch(`${config.public.apiBaseUrl}/auth/login`, {
    method: "POST",
    body: payload,
  });
}
