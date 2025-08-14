const Server = require('../database/models/Server');

// GET all servers
exports.getAll = async (req, res) => {
  try {
    const servers = await Server.find();
    res.json(servers);
  } catch (err) {
    console.error("❌ Failed to fetch servers:", err.message);
    res.status(500).send("Internal Server Error");
  }
};

// POST create a new server
exports.create = async (req, res) => {
  try {
    // Check if port already exists
    const existingServer = await Server.findOne({ port: req.body.port });
    if (existingServer) {
      console.warn(`⚠️ Port ${req.body.port} already in use by server: ${existingServer.name}`);
      return res.status(400).json({ error: `Port ${req.body.port} is already in use` });
    }

    const server = new Server(req.body);
    await server.save();

    console.log(`✅ Server created: ${server.name} (Port: ${server.port})`);
    res.status(201).json(server);

  } catch (err) {
    // Handle duplicate key error (in case it still happens)
    if (err.code === 11000) {
      console.error("❌ Duplicate key error:", err.message);
      return res.status(400).json({ error: `Duplicate key: ${JSON.stringify(err.keyValue)}` });
    }

    console.error("❌ Failed to create server:", err.message);
    res.status(500).send("Failed to create server");
  }
};

// PUT update a server
exports.update = async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!server) {
      console.warn("⚠️ Server not found to update");
      return res.status(404).send("Server not found");
    }
    console.log(`🔄 Server updated: ${server.name} (Port: ${server.port})`);
    res.json(server);
  } catch (err) {
    if (err.code === 11000) {
      console.error("❌ Duplicate key error:", err.message);
      return res.status(400).json({ error: `Duplicate key: ${JSON.stringify(err.keyValue)}` });
    }
    console.error("❌ Failed to update server:", err.message);
    res.status(500).send("Failed to update server");
  }
};

// DELETE a server
exports.remove = async (req, res) => {
  try {
    const server = await Server.findByIdAndDelete(req.params.id);
    if (!server) {
      console.warn("⚠️ Server not found to delete");
      return res.status(404).send("Server not found");
    }
    console.log(`🗑️ Server deleted: ${server.name} (Port: ${server.port})`);
    res.status(204).send();
  } catch (err) {
    console.error("❌ Failed to delete server:", err.message);
    res.status(500).send("Failed to delete server");
  }
};
