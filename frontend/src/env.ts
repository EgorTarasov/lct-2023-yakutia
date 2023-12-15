const vars = import.meta.env;

export const env = {
  BACK_API_URL: vars.VITE_APP_API_HOST,
  FRONT_URL_PROD: vars.VITE_APP_HOST_PROD,
  CLIENT_ID: vars.VITE_APP_CLIENT_ID,
  FRONT_URL_LOCAL: vars.VITE_APP_HOST_LOCAL,
  MODE: vars.VITE_APP_MODE
};
