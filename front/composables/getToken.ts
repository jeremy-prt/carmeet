export const getToken = () => {
  const token = useCookie("token");
  return token.value;
};
