const { fork } = require('child_process');
const path = require('path');
require('dotenv').config();

const Server = require('./database/models/Server');
const connectDB = require('./database');

const runningPorts = new Set();

const startServerProcess = (server) => {
  if (runningPorts.has(server.port)) return;

  const child = fork(path.join(__dirname, 'serverRunner.js'), [], {
    env: {
      ...process.env,
      PORT: server.port,
      SERVER_NAME: server.name,
      REGION: server.region
    }
  });

  runningPorts.add(server.port);
  console.log(`✅ [Manager] Started ${server.name} on port ${server.port}`);
};

const start = async () => {
  await connectDB();

  const servers = await Server.find({ isActive: true });
  servers.forEach(startServerProcess);

  setInterval(async () => {
    const updatedServers = await Server.find({ isActive: true });
    updatedServers.forEach(startServerProcess);
  }, 10000); 
};

start();
