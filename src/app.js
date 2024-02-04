"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ip_1 = __importDefault(require("ip"));
const dns_1 = __importDefault(require("dns"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    // Check X-Forwarded-For and fallback to X-Real-IP, then to req.connection.remoteAddress
    var _a, _b;
    const clientIp = (_b = (_a = req.headers["x-forwarded-for"]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : ip_1.default.address();
    const obj = {
        "req.headers[x-forwarded-for]": req.headers["x-forwarded-for"],
        "req.headers[x-real-ip]": req.headers["x-real-ip"],
        "req.socket.remoteAddress": req.socket.remoteAddress,
        "req.ip": req.ip,
        "req.socket.localAddress": req.socket.localAddress,
        "ip.address": ip_1.default.address(),
        " req.headers.host": req.headers.host,
        "req.hostname": req.hostname,
    };
    try {
        dns_1.default.reverse(clientIp, (err, hostnames) => {
            if (err) {
                console.error("Reverse DNS lookup failed:", err);
                res.status(500).send({ error: "Error fetching data,", clientIp });
            }
            else {
                const domainName = hostnames && hostnames.length > 0 ? hostnames[0] : "Unknown";
                // Send the result back to the client
                res.send({
                    obj,
                    domainName: domainName || "",
                    clientIp: clientIp || "notfound",
                });
            }
        });
    }
    catch (error) {
        res.send({ statue: "error", obj, message: error });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
