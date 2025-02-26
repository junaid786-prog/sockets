const userSocketMap = {}; 
const chatSocket = (io) => {
    io.on("connection", (socket) => {

        socket.on("join_room", ({ roomId, userId }) => {
            socket.join(roomId);
            userSocketMap[userId] = socket.id; // Store userId and socketId mapping
            console.log(`User ${userId} joined room: ${roomId}`);
        });

        socket.on("send_message", ({ roomId, userId, messageContent }) => {
            if (!messageContent) return;

            // Emit message to all users in the room
            io.to(roomId).emit("receive_message", {
                userId,
                messageContent
            });

            console.log(`Message sent by ${userId} in room: ${roomId}`);
        });

        // When a user leaves the chat room
        socket.on("leave_room", ({ roomId, userId }) => {
            socket.leave(roomId);
            delete userSocketMap[userId]; // Remove userId to socketId mapping
            console.log(`User ${userId} left room: ${roomId}`);
        });

        // When a user disconnects
        socket.on("disconnect", () => {
            // Find the userId from socketId if needed, and remove from userSocketMap
            const userId = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
            if (userId) {
                delete userSocketMap[userId];
                console.log(`User ${userId} disconnected`);
            }
        });
    });
};

module.exports = chatSocket;
