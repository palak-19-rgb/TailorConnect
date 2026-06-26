const { io } = require("socket.io-client");

const CLIENTS = 100;

let connected = 0;
let received = 0;

for (let i = 0; i < CLIENTS; i++) {

  const socket = io("http://localhost:1000");

  socket.on("connect", () => {

    connected++;

    socket.emit("joinRoom", "testroom");

    socket.emit("sendMessage", {
      room: "testroom",
      message: {
        sender: `user${i}`,
        text: `hello from ${i}`
      }
    });

    console.log(`Connected ${i}`);
  });

  socket.on("receiveMessage", () => {
    received++;
  });
}

setTimeout(() => {
  console.log("Connected Clients:", connected);
  console.log("Messages Received:", received);
  process.exit();
}, 10000);