const http = require('http');
const { Server } = require('socket.io');
const chatSocket = require('./sockets/chatSocket');

const port = 5002;

const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } });

const initializeSockets = (io) => {
    chatSocket(io);
};

initializeSockets(io);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
