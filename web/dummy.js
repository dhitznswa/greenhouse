setInterval(() => {
  fetch("http://localhost:2525/sensor/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-device-id": "esp32-001",
      "x-device-key": "dhitznswa",
    },
    body: JSON.stringify({
      temperature: Math.floor(Math.random() * 10) + 30,
      humidity: Math.floor(Math.random() * 20) + 40,
      gas: 89,
      flame: false,
    }),
  }).then((data) => console.log(data.body));
}, 3000);
