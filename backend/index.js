const express = require("express");
const app = express();
const generateRandomColor = require("./utils");

const userColors = new Map();

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

function getAvailableRooms() {
  const temp = [];

  io.sockets.adapter.rooms.forEach((value, key) => {

    if (!io.sockets.sockets.has(key))
      temp.push(key);


  });

  return temp;

}

io.on("connection", (socket) => {
  console.log("a user connected");

  // Send available rooms
  io.to(socket.id).emit("available rooms", getAvailableRooms());

  // When a user creates a new room
  socket.on("create room", (room) => {

    // Create
    socket.join(room);

    // Assign color to user
    userColors.set(socket.id, generateRandomColor());

    // notify the user about his color
    io.to(socket.id).emit("color", userColors.get(socket.id));


    io.emit("available rooms", getAvailableRooms());

  });

  socket.on("join room", ({ username, room }) => {

    // Join
    socket.join(room);

    // Assign color to user
    userColors.set(socket.id, generateRandomColor());

    // notify the user about his color
    io.to(socket.id).emit("color", userColors.get(socket.id));

    // notify the room
    socket.to(room).emit("message", {
      username,
      color: userColors.get(socket.id),
      content: `${username} has entered the chat!`,
      isInfo: true,
      isMe: false
    });

  });

  socket.on("send message", ({ room, username, content, color }) => {
    socket.to(room).emit("message", {
      username,
      content,
      color: userColors.get(socket.id),
      isMe: false,
      isInfo: false
    });
  });

  socket.on("leave room", ({ username, room }) => {

    // notify the room
    socket.to(room).emit("message", {
      username,
      content: `${username} has left the chat!`,
      color: userColors.get(socket.id),
      isInfo: true,
      isMe: false
    });

    // Leave
    socket.leave(room);

    // Remove color from user
    userColors.delete(socket.id);

    io.emit("available rooms", getAvailableRooms());

  })

  socket.on("disconnect", () => {
    console.log("a user disconnected");

    io.emit("available rooms", getAvailableRooms());
  })
});