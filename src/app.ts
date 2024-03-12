import express from "express";
import ip from "ip";
import dns from "dns";
import {
  isWhitelistedIP4,
  IP_WHITELISTING_TYPE,
  HOSTING_INFO_TYPE,
} from "./check";
const app = express();

app.get("/", async (req, res) => {
  // Check X-Forwarded-For and fallback to X-Real-IP, then to req.connection.remoteAddress

  let clientIP =
    typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"]?.split(",")?.shift()?.trim()
      : "";

  if (!clientIP) {
    clientIP = "";
  }
  const hostingInfo: HOSTING_INFO_TYPE = {
    domainName: "",
    ipWhiteListingType: IP_WHITELISTING_TYPE.IPV4_ADDRESSES_WHITELIST,
    ipv4Addresses: ["35.157.117.28", "89.247.*", "192.168.1.1/24"],
  };
  const whiteListStatus = await isWhitelistedIP4(clientIP, hostingInfo);
  console.log(`Whitelist status why not coming ${whiteListStatus}`);
  const obj = {
    whiteListStatus: whiteListStatus || "No Status",
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
    dns.reverse(clientIP, (err, hostnames) => {
      if (err) {
        console.error("Reverse DNS lookup failed:", err);
        res.status(500).send({ error: "Error fetching data,", clientIP });
      } else {
        const domainName =
          hostnames && hostnames.length > 0 ? hostnames[0] : "Unknown";

        // Send the result back to the client
        res.send({
          obj,
          domainName: domainName || "",
          clientIp: clientIP || "notfound",
        });
      }
    });
  } catch (error: any) {
    res.send({ statue: "error", obj, message: error });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
