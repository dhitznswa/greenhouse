import "dotenv/config";

export const config = {
  // App Settings
  env: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // Port
  port: process.env.PORT || 3000,

  // MQTT Broker
  mqtt: {
    broker: process.env.MQTT_BROKER || "mqtt://127.0.0.2:1883",
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  },

  // JSON Web Token
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",

  // Cookie Settings
  cookieName: "auth_accessToken",
};
