"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ip_1 = __importDefault(require("ip"));
function isCIDRFormat(ipPattern) {
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    return cidrRegex.test(ipPattern);
}
const ipPatternToRegex = (ipPattern) => {
    const escapedPattern = ipPattern.replace(/\./g, "\\."); // Escape dots
    const wildcardPattern = escapedPattern.replace(/\*/g, ".*"); // Replace * with .*
    // Construct the regular expression pattern
    const regexPattern = `^${wildcardPattern}$`;
    console.log(`${ipPattern} ${wildcardPattern} ${regexPattern}`);
    return new RegExp(regexPattern);
};
// Example usage
const clientIP = "192.10.1.2"; // Replace this with the actual client IP
// Whitelist patterns
const whitelistPatterns = ["192.*.*.*", "198.198.1.123", "10.10.1.1/24"];
const checkWhiteList = (clientIP) => {
    let status = false;
    status = /^\d+\.\d+\.\d+\.\d+$/.test(clientIP);
    if (status) {
        console.log("Format test pass");
        status = whitelistPatterns.some((pattern) => {
            if (isCIDRFormat(pattern)) {
                return ip_1.default.cidrSubnet(pattern).contains(clientIP);
            }
            else {
                return ipPatternToRegex(pattern).test(clientIP);
            }
        });
    }
    return status;
};
// Check if the clientIP matches any whitelist pattern
const isWhitelisted = checkWhiteList(clientIP);
if (isWhitelisted) {
    // IP is whitelisted, proceed with your logic
    console.log(`Client IP ${clientIP} is whitelisted.`);
}
else {
    // IP is not whitelisted, handle accordingly
    console.log(`Client IP ${clientIP} is not whitelisted.`);
}
