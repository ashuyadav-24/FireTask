let ioInstance = null;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join hostel room for hyper-local notifications
    socket.on('join:hostel', (hostelName) => {
      if (hostelName) {
        socket.join(hostelName);
        console.log(`[Socket.io] Socket ${socket.id} joined room: ${hostelName}`);
      }
    });

    // Join specific order room for live itemized progress
    socket.on('join:order', (orderId) => {
      if (orderId) {
        socket.join(`order:${orderId}`);
        console.log(`[Socket.io] Socket ${socket.id} joined order room: order:${orderId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  ioInstance = io;
  return io;
};

const getIO = () => {
  return ioInstance;
};

module.exports = { initSocket, getIO };
