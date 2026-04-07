var express = require("express");
var fileuploader = require("express-fileupload");
var cors = require("cors");
var path = require("path");
require("dotenv").config();

const CustomerRouter = require("./routers/Customer");
const TailorRouter = require("./routers/Tailor");
const TailorCustomerRouter = require("./routers/TailorCustomer");
var { connectToMongoDB } = require("./config/dbConnect");
const Message=require("./models/Messages")

var app = express();

// ✅ CORS first
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// ✅ body parser SECOND
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileuploader());

// ✅ static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ routes AFTER middleware
app.use("/TailorCustomer", TailorCustomerRouter);
console.log("CustomerRouter:", CustomerRouter);

app.use("/customer", CustomerRouter);

console.log("Customer route mounted");
app.use("/Tailor", TailorRouter);


const tailorController = require("./controllers/Tailor");
app.post("/Login", tailorController.Login);

connectToMongoDB();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ⭐ GLOBAL (future use ke liye)
global.io = io;

// 🔥 SOCKET LOGIC
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

socket.on("sendMessage", async ({ room, message }) => {

  const fixedRoom = room.trim().toLowerCase(); // ✅ FIX

  await Message.create({
    room: fixedRoom,
    text: message.text,
    sender: message.sender
  });

  io.to(fixedRoom).emit("receiveMessage", message);
});

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/messages/:room", async (req, res) => {
  try {
    const room = req.params.room.trim().toLowerCase(); // ✅ FIX

    const msgs = await Message.find({ room });

    console.log("FETCH ROOM:", room);
    console.log("FOUND:", msgs.length);

    res.json(msgs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "error" });
  }
});





const PORT = process.env.PORT || 1000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`server + socket running on ${PORT}`);
});
// 404
app.use((req, res) => {
  console.log(req.method, req.url);
  res.status(404).send("invalid url");
});


