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
/* 
socket.on('connect', function () {}): 
connect event เหตุการณ์การเชื่อมต่อถูกปล่อยออกมา เมื่อเชื่อม socket สำเร็จ

socket.on('connecting', function () {}):
connecting event เป็น emitted socket ที่พยายามเชื่อมต่อกับ server

socket.on('disconnect', function () {}):
disconnect event จะได้ emitted เมื่อ socket เชื่อมต่อไม่สำเร็จ

socket.on('connect_failed', function () {}):
event connect_failed จะได้ emitted เมื่อ socket เชื่อมต่อกับ server ไม่ได้

socket.on('error', function () {}):
event error จะได้ emitted ในกรณีที่ไม่มี event ตัวไหนจัดการ error ได้

socket.on('message', function (message, callback) {}):
event message จะได้ emitted เมื่อใช้ socket.send และจะได้รับ parameter สองตัวคือ message และ callback และ callback เป็น optional 

socket.on('anything', function(data, callback) {}):
event anything เป็น event อะไรก็ได้ยกเว้น event ที่สงวนไว้มีพารามิเตอร์ 2 ตัวคือ data และ callback

socket.on('reconnect_failed', function () {}):
event reconnect_failed จะได้ emitted เมื่อ socket.io ล้มเหลวในการสร้างการทำงานใหม่
จะเป็นลักษณะของการเชื่อมต่อหลุดแล้วจะเชื่อมต่อใหม่แล้วมันล้มเหลวในการเชื่อมต่อ

socket.on('reconnect', function () {}):
reconnect event จะได้ emitted เมื่อ socket.io เชื่อมต่อกับ server ได้สำเร็จอีกครั้ง

socket.on('reconnecting', function () {}):
reconnecting event จะได้ emitted เมื่อ socket พยายามเชื่อมต่อกับ server

*/