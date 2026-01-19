const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true,
    unique: true
  },
  region: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastHealthStatus: {
    type: String,
    enum: ['healthy', 'unhealthy', 'down'],
    default: 'healthy'
  },
  lastCheckedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Server', serverSchema);
