setInterval(() => {
  fetch("http://localhost:2525/sensor/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-device-id": "P0CtRicFW2",
      "x-device-key": "5N2PgBOEEhgXVjirmRwCG8svt",
    },
    body: JSON.stringify({
      temperature: Math.floor(Math.random() * 40) + 30,
      humidity: Math.floor(Math.random() * 30) + 40,
      gas: 600,
      flame: false,
    }),
  })
    .then((data) => data.json())
    .then((json) => console.log(json));
}, 5000);
