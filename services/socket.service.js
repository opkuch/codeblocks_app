var gIo = null

function setupSocketAPI(http) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  })
  gIo.on('connection', (socket) => {
    // New connected socket
    socket.on('block-set-topic', (topic) => {
      if (socket.myTopic === topic) return
      if (socket.myTopic) {
        socket.leave(socket.myTopic)
        // Socket is leaving topic
      }
      // Socket joining new topic
      socket.join(topic)
      // Attach new topic to socket properties
      socket.myTopic = topic
    })
    socket.on('user-connected', async (blockId) => {
        const sockets = await gIo.in(blockId).fetchSockets()
        // Firing back an event with current online users
        gIo.emit('update-room-counter', sockets.length)
    })
    socket.on('update-block', (block) => {
      // Broadcast updated block from socket
      broadcast({
        type: 'block-updated',
        data: block,
        room: socket.myTopic,
      })
    })
  })
}


// If possible, send to all sockets BUT not the current socket
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null }) {
  // Broadcasting event
  if (room) {
    // Emit to room
    gIo.to(room).emit(type, data)
  } else {
    // Emit to all
    gIo.emit(type, data)
  }
}

module.exports = {
  // set up the sockets service and define the API
  setupSocketAPI,
  // Send to all sockets BUT not the current socket - if found
  // (otherwise broadcast to a room / to all)
  broadcast,
}
