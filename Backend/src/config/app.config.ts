import { getEnv } from "../utils/getEnv.util";

export const appConfig = () => {
  return {
    PORT: Number(getEnv("PORT", "8080")),
    MONGO_URI: getEnv("MONGO_URI", ""),
    FRONTEND_ORIGIN: getEnv(
      "PRODUCTION_FRONTEND_ORIGIN",
      "LOCAL_FRONTEND_ORIGIN",
    ),
    SUPERADMIN_EMAIL: getEnv("SUPERADMIN_EMAIL", ""),
    SUPERADMIN_PASSWORD: getEnv("SUPERADMIN_PASSWORD", ""),
    JWT_SECRET: getEnv("JWT_SECRET", "") as string,
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "3d"), // 3 days
  };
};

export const config = appConfig();
