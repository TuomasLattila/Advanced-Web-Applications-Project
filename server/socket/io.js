const { Server } = require('socket.io')
let io;

module.exports = {
    init: (server) => {
        io = new Server(server, { cors: { origin: "http://localhost:3000"}});
        console.log('io initialized')
        return io;
    },
    getIO: () => {
        if (!io) { 
          return console.log('io not initialized!')
        } 
        return io;
    }   
};