const express = require("express");
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
const server = app.listen(
  3000,
  console.log("Socket.io Hello Wolrd server started")
);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

io.on("connection", (socket) => {
  socket.send(
    JSON.stringify({
      type: "serverMessage",
      message: "Welcome to the most interesting chat room on earth!",
    })
  );
  socket.on("message", (message) => {
    message = JSON.parse(message);
    if (message.type == "userMessage") {
      socket.broadcast.emit('message', JSON.stringify(message));
      message.type = "myMessage";
      socket.send(JSON.stringify(message));
    }
  });
});
