import paho.mqtt.client as mqtt
import time
import json
import random
from datetime import datetime

# ===================== KONFIGURASI =====================
BROKER = "localhost"          # atau IP server mu kalau remote
PORT = 1883                   # ganti kalau kamu ubah port Mosquitto
TOPIC = "sensors/update"

USERNAME = "dhitznswa"         # ganti dengan username Mosquitto mu
PASSWORD = "dhitznswa"        # ganti dengan password Mosquitto mu

PUBLISH_INTERVAL = 10         # detik, ubah ke 10 atau 30 kalau mau lebih ringan
# =======================================================

# Nilai awal realistis untuk rumah di Indonesia
current_temp = 40.0
current_hum = 65.0

# MQTT Client setup
client = mqtt.Client(client_id="DummySensorHome")
client.username_pw_set(USERNAME, PASSWORD)
client.connect(BROKER, PORT, keepalive=60)

client.loop_start()  # jalankan di background

print(f"Dummy sensor mulai publish ke {BROKER}:{PORT} topic '{TOPIC}' setiap {PUBLISH_INTERVAL} detik...")
print("Tekan Ctrl+C untuk stop.\n")

try:
    while True:
        # Simulasi perubahan gradual suhu & kelembaban
        current_temp += random.uniform(-0.3, 0.5)
        current_hum += random.uniform(-1.5, 1.5)

        # Clamp ke range realistis rumah
        current_temp = max(20.0, min(37.0, current_temp))
        current_hum = max(40.0, min(90.0, current_hum))

        # Gas level: normal 200-500, kadang spike bocor
        if random.random() < 0.50:  # 3% chance alert gas
            gas_level = random.randint(900, 1500)
        else:
            gas_level = random.randint(200, 500)

        # Flame: jarang terdeteksi
        flame_detected = 1 if random.random() < 0.01 else 0  # 1% chance api

        # Payload JSON
        payload = {
            "deviceCode": "esp32-x02i",
            "temp": 39,
            "hum": round(current_hum, 1),
            "gas": gas_level,
            "flame": flame_detected,
            "timestamp": datetime.now().isoformat()
        }

        # Publish
        client.publish(TOPIC, json.dumps(payload))
        
        # Print ke console biar kelihatan
        status = ""
        if gas_level > 800:
            status += " ⚠️ GAS TINGGI!"
        if flame_detected == 1:
            status += " 🔥 API TERDETEKSI!"

        print(f"[{datetime.now().strftime('%H:%M:%S')}] Published: Temp={payload['temp']}°C, "
              f"Hum={payload['hum']}%, Gas={payload['gas']}, Flame={payload['flame']}{status}")

        time.sleep(PUBLISH_INTERVAL)

except KeyboardInterrupt:
    print("\nDummy sensor dihentikan.")
finally:
    client.loop_stop()
    client.disconnect()
    print("Disconnected dari MQTT broker.")