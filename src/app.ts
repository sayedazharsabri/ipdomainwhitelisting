import express from "express";
import ip from "ip";
import dns from "dns";
const app = express();

app.get("/", (req, res) => {
  // Check X-Forwarded-For and fallback to X-Real-IP, then to req.connection.remoteAddress

  const clientIp = ip.address();
  const obj = {
    "req.headers[x-forwarded-for]": req.headers["x-forwarded-for"],
    "req.headers[x-real-ip]": req.headers["x-real-ip"],
    "req.socket.remoteAddress": req.socket.remoteAddress,
    "req.ip": req.ip,
    "req.socket.localAddress": req.socket.localAddress,
    "ip.address": ip.address(),

    " req.headers.host": req.headers.host,
    "req.hostname": req.hostname,
  };

  try {
    dns.reverse(clientIp, (err, hostnames) => {
      if (err) {
        console.error("Reverse DNS lookup failed:", err);
        res.status(500).send("Error fetching data");
      } else {
        const domainName =
          hostnames && hostnames.length > 0 ? hostnames[0] : "Unknown";

        // Send the result back to the client
        res.send({ obj, domainName: domainName || "", reqHeader: req.header });
      }
    });
  } catch (error) {
    res.send({ statue: "error", obj });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
