const logger = require('./logger');

class WebSocketTracker {
  constructor(socket) {
    this.socket = socket;
    this.initialize();
  }

  initialize() {
    logger.info('WebSocket connection initialized', { socketId: this.socket.id });

    this.socket.on('join_room', (data) => {
      logger.info('Driver joined telemetry room', { 
        socketId: this.socket.id, 
        roomId: data.roomId,
        driverId: data.driverId 
      });
    });

    this.socket.on('telemetry_ping', (payload) => {
      // High-frequency operational frames routed to debug level to prevent log inflation
      logger.debug('Received high-frequency telemetry ping', {
        socketId: this.socket.id,
        driverId: payload.driverId,
        coords: payload.coordinates
      });
    });

    this.socket.on('disconnect', (reason) => {
      logger.info('WebSocket pipeline disconnected', { 
        socketId: this.socket.id, 
        disconnectReason: reason 
      });
    });

    this.socket.on('error', (error) => {
      logger.error('WebSocket connection operational failure', {
        socketId: this.socket.id,
        errorMessage: error.message,
        errorStack: error.stack
      });
    });
  }
}

module.exports = WebSocketTracker;
