const http = require("http");
const connectDB = require("./database");
const Server = require("./database/models/Server");
require("dotenv").config();

const HEALTH_CHECK_INTERVAL = Number(process.env.HEALTH_CHECK); // ms
const LOG_DELAY = 2000; // 2 seconds delay per server

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkHealth() {
  const servers = await Server.find();

  for (const server of servers) {
    await new Promise((resolve) => {
      const req = http.request(
        {
          hostname: "localhost",
          port: server.port,
          path: "/health",
          method: "GET",
          timeout: 3000,
        },
        (res) => {
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

          resolve();
        }
      );

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

        resolve();
      });

      req.end();
    });

    // ⏳ wait 2 seconds before checking next server
    await wait(LOG_DELAY);
  }
}

async function startMonitoring() {
  await connectDB();

  console.log(
    `🩺 Health monitor started. Checking every ${
      HEALTH_CHECK_INTERVAL / 1000
    } seconds.`
  );

  while (true) {
    await checkHealth(); // wait until finished
    await wait(HEALTH_CHECK_INTERVAL); // wait before next round
  }
}

startMonitoring();
