export interface RequestSensorData {
  deviceCode: string;
  temp?: number | null;
  hum?: number | null;
  gas?: number | null;
  flame?: number | null;
}

export interface SensorData {
  deviceCode: string;
  temperature?: number | null;
  humidity?: number | null;
  gasLevel?: number | null;
  flameDetected?: number | null;
}
