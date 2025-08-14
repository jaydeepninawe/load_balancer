const http = require("http");
const connectDB = require("./database");
const Server = require("./database/models/Server");
require("dotenv").config();

const HEALTH_CHECK_INTERVAL = process.env.HEALTH_CHECK; // ms

async function checkHealth() {
  const servers = await Server.find();

  servers.forEach((server) => {
    const options = {
      hostname: "localhost",
      port: server.port,
      path: "/health",
      method: "GET",
      timeout: 3000,
    };

    const req = http.request(options, (res) => {
      const isHealthy = res.statusCode === 200;
      const status = isHealthy ? "healthy" : "unhealthy";

      console.log(
        `${isHealthy ? "✅" : "⚠️"} [${new Date().toISOString()}] ${
          server.name
        } (port ${server.port}) is ${status}`
      );

      Server.findByIdAndUpdate(server._id, {
        lastHealthStatus: status,
        lastCheckedAt: new Date(),
      }).exec();
    });

    req.on("error", () => {
      console.log(
        `❌ [${new Date().toISOString()}] ${server.name} (port ${
          server.port
        }) is DOWN`
      );

      Server.findByIdAndUpdate(server._id, {
        lastHealthStatus: "down",
        lastCheckedAt: new Date(),
      }).exec();
    });

    req.end();
  });
}

async function startMonitoring() {
  await connectDB();
  console.log(
    `🩺 Health monitor started. Checking every ${
      HEALTH_CHECK_INTERVAL / 1000
    }s.`
  );
  checkHealth(); // run immediately
  setInterval(checkHealth, HEALTH_CHECK_INTERVAL);
}

startMonitoring();
