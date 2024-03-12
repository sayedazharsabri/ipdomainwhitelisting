"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ip_1 = __importDefault(require("ip"));
const check_1 = require("./check");
const app = (0, express_1.default)();
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check X-Forwarded-For and fallback to X-Real-IP, then to req.connection.remoteAddress
    var _a, _b, _c;
    let clientIP = typeof req.headers["x-forwarded-for"] === "string"
        ? (_c = (_b = (_a = req.headers["x-forwarded-for"]) === null || _a === void 0 ? void 0 : _a.split(",")) === null || _b === void 0 ? void 0 : _b.shift()) === null || _c === void 0 ? void 0 : _c.trim()
        : "";
    if (!clientIP) {
        clientIP = "";
    }
    const hostingInfo = {
        domainName: "",
        ipWhiteListingType: check_1.IP_WHITELISTING_TYPE.IPV4_ADDRESSES_WHITELIST,
        ipv4Addresses: ["35.157.117.28", "89.247.*", "192.168.1.1/24"],
    };
    const whiteListStatus = yield (0, check_1.isWhitelistedIP4)(clientIP, hostingInfo);
    console.log(`Whitelist status why not coming ${whiteListStatus}`);
    const obj = {
        whiteListStatus: whiteListStatus || "No Status",
        "req.headers[x-forwarded-for]": req.headers["x-forwarded-for"],
        "req.headers[x-real-ip]": req.headers["x-real-ip"],
        "req.socket.remoteAddress": req.socket.remoteAddress,
        "req.ip": req.ip,
        "req.socket.localAddress": req.socket.localAddress,
        "ip.address": ip_1.default.address(),
        " req.headers.host": req.headers.host,
        "req.hostname": req.hostname,
    };
    res.send({
        obj,
        clientIp: clientIP || "notfound",
    });
    // try {
    //   dns.reverse(clientIP, (err, hostnames) => {
    //     if (err) {
    //       console.error("Reverse DNS lookup failed:", err);
    //       res.status(500).send({ error: "Error fetching data,", clientIP });
    //     } else {
    //       const domainName =
    //         hostnames && hostnames.length > 0 ? hostnames[0] : "Unknown";
    //       // Send the result back to the client
    //       res.send({
    //         obj,
    //         domainName: domainName || "",
    //         clientIp: clientIP || "notfound",
    //       });
    //     }
    //   });
    // } catch (error: any) {
    //   res.send({ statue: "error", obj, message: error });
    // }
}));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
