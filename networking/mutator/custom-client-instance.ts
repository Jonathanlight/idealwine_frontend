import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

let apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
export let realApiBaseURL = process.env.NEXT_PUBLIC_REAL_API_BASE_URL ?? "";

// adapt API base URL in the browser if visiting the app from other device in the same local network
const originalHostname = apiBaseURL.split(":")[1].replace("//", "");

if (
  typeof window !== "undefined" &&
  originalHostname === "localhost" &&
  !/[a-z]/.test(window.location.hostname)
) {
  const originalProtocol = apiBaseURL.split(":")[0];
  const originalPort = apiBaseURL.split(":")[2] as string | undefined;

  apiBaseURL = `${originalProtocol}://${window.location.hostname}`;
  if (originalPort !== undefined) apiBaseURL = `${apiBaseURL}:${originalPort}`;

  realApiBaseURL = apiBaseURL;
}

export const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  headers: { Accept: "application/ld+json, application/json" },
});

export const refreshTokenAxiosInstance = axios.create({ baseURL: realApiBaseURL });

export let markAxiosAsInitialized: () => void;
const isAxiosInitializing: Promise<void> = new Promise(resolve => {
  markAxiosAsInitialized = resolve;
});

export const customAxiosInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  if (typeof window !== "undefined") await isAxiosInitializing;

  return axiosInstance({ ...config, ...options });
};

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => customAxiosInstance<T>(config, options).then(({ data }) => data);
