const express = require("express");
const httpProxy = require("http-proxy");
const geoip = require("geoip-lite");
const connectDB = require("./database");
const Server = require("./database/models/Server");
const rateLimiter = require("./middlewares/rateLimiter");
require("dotenv").config();
const cors = require("cors");

// Enable CORS for all routes

const proxy = httpProxy.createProxyServer();
const DEFAULT_REGION = "DEFAULT";
const PORT = process.env.LB_PORT || 8080;
const rrIndex = {}; // Track round robin index per region

const app = express();
app.use(cors()); // Enable CORS for all routes

// 🟢 FIX: Tell Express to trust the X-Forwarded-For header from the proxy
// This is crucial for the rate limiter to work correctly.
app.set("trust proxy", 1); 

app.use(rateLimiter);

// Proxy error handling
proxy.on("error", (err, req, res) => {
  console.error("🔴 Proxy Error:", err.message);
  res.status(500).send("Internal Proxy Error");
});

// Round robin picker
function getNextServer(region, servers) {
  if (servers.length === 1) return servers[0];
  if (!rrIndex[region]) rrIndex[region] = 0;

  const server = servers[rrIndex[region]];
  rrIndex[region] = (rrIndex[region] + 1) % servers.length;

  return server;
}

// naya local middleware 
app.use(async (req, res) => {
  try {
    const rawIP = (
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      ""
    )
      .split(",")[0]
      .trim();
    const clientIP = rawIP.replace(/^::ffff:/, "");

    // Geo lookup
    const geo = geoip.lookup(clientIP);
    const country = geo?.country || DEFAULT_REGION;

    // Find servers for this region
    let candidates = await Server.find({ region: country, isActive: true });

    // Fallback to default region if none found
    if (!candidates.length) {
      candidates = await Server.find({
        region: DEFAULT_REGION,
        isActive: true,
      });
    }

    if (!candidates.length) {
      return res.status(503).send("❌ No healthy servers available");
    }
    const ip = "172.19.0.1";
    // Round robin selection
    const targetServer = getNextServer(country, candidates);
    const targetUrl = `http://localhost:${targetServer.port}`;

    console.log(`🌍 ${clientIP} (${country}) → ${targetUrl}`);
    proxy.web(req, res, { target: targetUrl });
  } catch (err) {
    console.error("⚠️ Load balancer error:", err.message);
    res.status(500).send("Internal Load Balancer Error");
  }
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Geo Load Balancer running at http://localhost:${PORT}`);
  });
});
