import jwtDecode from "jwt-decode";

const gesdinet_jwt_refresh_token_ttl = 1800; // 30 minutes in seconds. Don't forget to change it in the backend (config/packages/gesdinet_jwt_refresh_token.yaml) too

const isAccessTokenExpired = (accessToken: string) =>
  jwtDecode<{ exp: number }>(accessToken).exp - Date.now() / 1000 < 10; // consider as expired 10 seconds before expiration

export const isAccessTokenValid = (accessToken?: string): accessToken is string =>
  accessToken !== undefined && !isAccessTokenExpired(accessToken);

export const getSessionExpirationTimeoutInSeconds = (accessToken: string) =>
  gesdinet_jwt_refresh_token_ttl -
  60 + // consider as not refreshable 1 minute before refresh token expiration
  jwtDecode<{ iat: number }>(accessToken).iat -
  Date.now() / 1000;

export const isSessionValid = (accessToken?: string): accessToken is string =>
  accessToken !== undefined && getSessionExpirationTimeoutInSeconds(accessToken) > 0;
