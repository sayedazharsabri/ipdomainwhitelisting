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
    "req.hostname": req.hostname,
    "req.header(Origin1)": req.header("Origin"),
    "req.header(Host)": req.header("Host"),
    "req.get('origin2')": req.get("origin"),
    originalUrl: req.originalUrl,
    "rawHeaders:": req.rawHeaders,
  };
  console.log(req);
  res.send({ obj, reqHeader: req.header });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
