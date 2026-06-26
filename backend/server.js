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
const ChatbotRouter = require("./routers/Chatbot");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");






var app = express();

// ✅ CORS first
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));





app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }   // ✅ images cross-origin se load ho sakein
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100   // ✅ testing ke liye reasonable
});

// sirf login/signup pe lagao (brute-force se bachne ke liye), poore app pe nahi
app.use("/Login", limiter);
app.use("/Tailor/Signup", limiter);
app.use("/customer/Signup", limiter);


// ✅ body parser SECOND
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileuploader());

// ✅ static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ routes AFTER middleware
app.use("/TailorCustomer", TailorCustomerRouter);
app.use("/customer", CustomerRouter);
console.log("Customer route mounted");
app.use("/Tailor", TailorRouter);
app.use("/chatbot", ChatbotRouter);    

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



// 404
app.use((req, res) => {
  console.log(req.method, req.url);
  res.status(404).send("invalid url");
});

const PORT = process.env.PORT || 1000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`server + socket running on ${PORT}`);
});



