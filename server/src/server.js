const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const app = require('./app');
const { initSocket } = require('./sockets/socketHandler');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostelcart';

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`[HostelCart] MongoDB connected successfully at: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.error(`[HostelCart] MongoDB connection warning: ${err.message}`);
    console.log('[HostelCart] Running server in resilient mode. Ensure MongoDB is started on port 27017.');
  });

server.listen(PORT, () => {
  console.log(`[HostelCart] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[HostelCart] Health check: http://localhost:${PORT}/api/health`);
});

module.exports = server;
