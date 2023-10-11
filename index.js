// const {onRequest} = require("firebase-functions/v2/https");

// const { initializeApp } = require("firebase/app");

const admin = require("firebase-admin");
const firebaseConfig = {
   apiKey: "AIzaSyAmIPsfEDhR8GblF9RUcia0h-mqr6Syjac",
   authDomain: "zoom-be87d.firebaseapp.com",
   projectId: "zoom-be87d",
   storageBucket: "zoom-be87d.appspot.com",
   messagingSenderId: "43973545642",
   appId: "1:43973545642:web:1b92509976e8c3830acad3",
 };

 // Initialize Firebase
 admin.initializeApp(firebaseConfig)
//  const admin = adinitializeApp(firebaseConfig);

// const logger = require("firebase-functions/logger");
// admin.initializeApp();

const express = require("express");
const cors= require("cors")
const app = express();
app.use(cors())
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const { Socket } = require("socket.io");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("Join-room", (Room_Id, userId) => {
    socket.join(Room_Id);
    socket.to(Room_Id).emit("user-connected", userId);

    // Assuming 'socket' is the Socket.IO socket object
    socket.on("message", (message) => {
      // send message to the same room
      io.to(Room_Id).emit("createMessage", message);
    });

    socket.on("disconnect", () => {
      socket.to(Room_Id).emit("user-disconnected", userId);
    });
  });
});

server.listen(process.env.PORT || 3000);
// exports.api = onRequest(server);

