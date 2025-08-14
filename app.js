const express = require("express");
const connectDB = require("./database");
const serverRoutes = require("./routes/servers");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.ADMIN_PORT;

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/servers", serverRoutes);

// DB+Server Init
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Admin API running on http://localhost:${PORT}`);
  });
});
