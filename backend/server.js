var express = require("express");
var fileuploader = require("express-fileupload");
var cors = require("cors");
const CustomerRouter = require("./routers/Customer");
const TailorRouter = require("./routers/Tailor");
var { connectToMongoDB } = require("./config/dbconnect");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

// routers
app.use("/Customer", CustomerRouter);
app.use("/Tailor", TailorRouter);
app.use("/user", CustomerRouter); 
app.use("/user", TailorRouter); 

connectToMongoDB();

app.listen(2007, () => {
  console.log("server started on 2007");
});

app.use((req, res) => {
  console.log(req.method, req.url);
  res.status(404).send("invalid url");
});