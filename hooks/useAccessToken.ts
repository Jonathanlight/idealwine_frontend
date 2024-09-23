import { useLocalStorageValue } from "@react-hookz/web";
import { useCallback } from "react";

import { ACCESS_TOKEN_KEY } from "@/utils/localStorageKeys";

export const useAccessToken = () => {
  const { value, set, remove } = useLocalStorageValue<{ token?: string }>(ACCESS_TOKEN_KEY);

  const setAccessToken = useCallback((token: string) => set({ token }), [set]);

  const removeAccessToken = useCallback(() => {
    set({}); // trigger storage events to update other tabs as the remove method doesn't trigger storage events
    remove();
  }, [set, remove]);

  return { accessToken: value?.token, setAccessToken, removeAccessToken };
};
