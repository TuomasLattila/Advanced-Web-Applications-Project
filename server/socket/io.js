const { Server } = require('socket.io')
let io;

//exports the io for two-ways communication with clients and server (for keeping the chat in real-time)
module.exports = {
    init: (server) => { //gets the server in the ./bin/www (initialization stage)
        io = new Server(server, { cors: { origin: "http://localhost:3000"}});
        io
        console.log('io initialized')  
        return io;
    },
    getIO: () => { //this is used to get the already initialized io (used in ./routes/chat)
        if (!io) { 
          return console.log('io not initialized!')
        } 
        return io;
    }   
};