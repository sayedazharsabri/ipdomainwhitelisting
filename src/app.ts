import express from "express";
import ip from "ip";
const app = express();

app.get("/", (req, res) => {
  // Check X-Forwarded-For and fallback to X-Real-IP, then to req.connection.remoteAddress

  const obj = {
    "req.headers[x-forwarded-for]": req.headers["x-forwarded-for"],
    "req.headers[x-real-ip]": req.headers["x-real-ip"],
    "req.socket.remoteAddress": req.socket.remoteAddress,
    "req.ip": req.ip,
    "req.socket.localAddress": req.socket.localAddress,
    "ip.address": ip.address(),

    " req.headers.host": req.headers.host,
  };
  res.send(obj);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
