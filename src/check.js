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
exports.isWhitelistedIP4 = exports.IP_WHITELISTING_TYPE = void 0;
const ip_1 = __importDefault(require("ip"));
var IP_WHITELISTING_TYPE;
(function (IP_WHITELISTING_TYPE) {
    IP_WHITELISTING_TYPE[IP_WHITELISTING_TYPE["NO_IP_WHITELISTING"] = 0] = "NO_IP_WHITELISTING";
    IP_WHITELISTING_TYPE[IP_WHITELISTING_TYPE["IPV4_ADDRESSES_WHITELIST"] = 1] = "IPV4_ADDRESSES_WHITELIST";
})(IP_WHITELISTING_TYPE = exports.IP_WHITELISTING_TYPE || (exports.IP_WHITELISTING_TYPE = {}));
function isCIDRFormat(ipPattern) {
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    return cidrRegex.test(ipPattern);
}
const ipPatternToRegex = (ipPattern) => {
    const escapedPattern = ipPattern.replace(/\./g, "\\.");
    const wildcardPattern = escapedPattern.replace(/\*/g, ".*");
    const regexPattern = `^${wildcardPattern}$`;
    return new RegExp(regexPattern);
};
const hostingInfo = {
    domainName: "",
    ipWhiteListingType: IP_WHITELISTING_TYPE.IPV4_ADDRESSES_WHITELIST,
    ipv4Addresses: ["192.*.*.*.*", "198.198.1.123", "10.10.1.1/24"],
};
const checkWhiteList = (clientIP, whitelistPatterns) => {
    let status = false;
    status = /^\d+\.\d+\.\d+\.\d+$/.test(clientIP);
    if (status) {
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
const isWhitelistedIP4 = (clientIP, hostingInfo) => __awaiter(void 0, void 0, void 0, function* () {
    if (hostingInfo.ipWhiteListingType === IP_WHITELISTING_TYPE.NO_IP_WHITELISTING) {
        return true;
    }
    if (hostingInfo.ipWhiteListingType ===
        IP_WHITELISTING_TYPE.IPV4_ADDRESSES_WHITELIST) {
        if (hostingInfo.ipv4Addresses.includes(clientIP)) {
            console.log("IP_WHITELISTING_TYPE.IPV4_ADDRESSES_WHITELIST");
            return true;
        }
        else {
            return checkWhiteList(clientIP, hostingInfo.ipv4Addresses);
        }
    }
});
exports.isWhitelistedIP4 = isWhitelistedIP4;
const clientIP = "192.168.2.111";
(0, exports.isWhitelistedIP4)(clientIP, hostingInfo).then((response) => console.log(response));
