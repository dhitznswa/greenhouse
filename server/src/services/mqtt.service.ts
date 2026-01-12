import mqtt from "mqtt";
import { io } from "./socket.service";
import { logger } from "../utils/logger";
import { RequestSensorData, SensorData } from "../types";
import { prisma } from "../utils/prisma";

let sensorBuffer: SensorData[] = [];
const BATCH_SIZE = 5;

const mqttClient = mqtt.connect(
  process.env.MQTT_BROKER || "mqtt://127.0.0.1:1883",
  {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 5000,
  }
);

mqttClient.on("connect", () => {
  logger.info("Connected to MQTT broker");
  mqttClient.subscribe("sensors/update");
});

mqttClient.on("error", (err) => {
  logger.error(`MQTT connection error: ${err.message}`);
});

mqttClient.on("message", async (topic, message) => {
  if (topic === "sensors/update") {
    try {
      const data: RequestSensorData = JSON.parse(message.toString()); // {deviceCode, temp, hum, gas, flame}
      logger.info(
        `Received sensor data from device with ID : ${data.deviceCode}`
      );

      const alerts = thresholdAlert({
        deviceCode: data.deviceCode,
        temperature: data.temp ?? null,
        humidity: data.hum ?? null,
        gasLevel: data.gas ?? null,
        flameDetected: data.flame ?? null,
      });

      if (alerts.length > 0) {
        alerts.forEach(async (alert) => {
          logger.warn(`Alert triggered: ${alert.type} - ${alert.message}`);
          io.emit("sensor:alert", alert);
        });
      }

      io.emit("sensor:update", data);

      sensorBuffer.push({
        deviceCode: data.deviceCode,
        temperature: data.temp ?? null,
        humidity: data.hum ?? null,
        gasLevel: data.gas ?? null,
        flameDetected: data.flame ?? null,
      });

      if (sensorBuffer.length >= BATCH_SIZE) {
        // Save to database
        try {
          await prisma.sensorReading.createMany({
            data: sensorBuffer,
            skipDuplicates: true,
          });

          logger.info(
            `Saved ${sensorBuffer.length} sensor readings to database`
          );
          sensorBuffer = [];
        } catch (err) {
          logger.error(
            `Error saving sensor readings to database: ${
              (err as Error).message
            }`
          );
        }
      }
    } catch (err) {
      logger.error(`Error processing MQTT message: ${(err as Error).message}`);
    }
  }
});

function thresholdAlert(payload: SensorData) {
  const THRESHOLD_TEMP_HIGH = 36; // Example threshold for high temperature
  const THRESHOLD_TEMP_LOW = 15; // Example threshold for low temperature
  const THRESHOLD_HUMIDITY_HIGH = 85;
  const THRESHOLD_HUMIDITY_LOW = 20;
  const THRESHOLD_GAS_LEVEL = 800; // Example threshold for gas level
  const THRESHOLD_FLAME_DETECTED = 1; // Example threshold for flame detection

  type AlertType = {
    type: string;
    message: string;
    severity: "WARNING" | "DANGER";
    value: number;
  };

  const alerts: AlertType[] = [];

  if (
    payload.flameDetected !== undefined &&
    payload.flameDetected === THRESHOLD_FLAME_DETECTED
  ) {
    alerts.push({
      type: "FLAME_DETECTED",
      message: `Api terdeteksi oleh sensor : ${payload.deviceCode}`,
      severity: "DANGER",
      value: payload.flameDetected,
    });
  }

  if (payload.temperature) {
    if (payload.temperature > THRESHOLD_TEMP_HIGH) {
      alerts.push({
        type: "HIGH_TEMPERATURE",
        message: `Suhu terlalu tinggi : ${payload.temperature}°C`,
        severity: "WARNING",
        value: payload.temperature,
      });
    }
    if (payload.temperature < THRESHOLD_TEMP_LOW) {
      alerts.push({
        type: "LOW_TEMPERATURE",
        message: `Suhu terlalu rendah : ${payload.temperature}°C`,
        severity: "WARNING",
        value: payload.temperature,
      });
    }
  }

  if (payload.humidity) {
    if (payload.humidity > THRESHOLD_HUMIDITY_HIGH) {
      alerts.push({
        type: "HIGH_HUMIDITY",
        message: `Kelembaban terlalu tinggi : ${payload.humidity}%`,
        severity: "WARNING",
        value: payload.humidity,
      });
    }
    if (payload.humidity < THRESHOLD_HUMIDITY_LOW) {
      alerts.push({
        type: "LOW_HUMIDITY",
        message: `Kelembaban terlalu rendah : ${payload.humidity}%`,
        severity: "WARNING",
        value: payload.humidity,
      });
    }
  }

  if (payload.gasLevel && payload.gasLevel > THRESHOLD_GAS_LEVEL) {
    alerts.push({
      type: "GAS_LEAK",
      message: `Bahaya! Gas terdeteksi: ${payload.gasLevel} ppm!`,
      severity: "DANGER",
      value: payload.gasLevel,
    });
  }

  return alerts;
}

export { mqttClient };
