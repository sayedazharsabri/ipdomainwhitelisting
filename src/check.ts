import ip from "ip";

export enum IP_WHITELISTING_TYPE {
  NO_IP_WHITELISTING = 0,
  IPV4_ADDRESSES_WHITELIST,
}

export type HOSTING_INFO_TYPE = {
  domainName: string;
  ipWhiteListingType: IP_WHITELISTING_TYPE;
  ipv4Addresses: string[];
};

function isCIDRFormat(ipPattern: string) {
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  return cidrRegex.test(ipPattern);
}

const ipPatternToRegex = (ipPattern: string) => {
  const escapedPattern = ipPattern.replace(/\./g, "\\.");
  const wildcardPattern = escapedPattern.replace(/\*/g, ".*");
  const regexPattern = `^${wildcardPattern}$`;
  return new RegExp(regexPattern);
};

const hostingInfo: HOSTING_INFO_TYPE = {
  domainName: "",
  ipWhiteListingType: IP_WHITELISTING_TYPE.IPV4_ADDRESSES_WHITELIST,
  ipv4Addresses: ["192.*.*.*.*", "198.198.1.123", "10.10.1.1/24"],
};

const checkWhiteList = (clientIP: string, whitelistPatterns: string[]) => {
  let status = false;
  status = /^\d+\.\d+\.\d+\.\d+$/.test(clientIP);

  if (status) {
    status = whitelistPatterns.some((pattern) => {
      if (isCIDRFormat(pattern)) {
        return ip.cidrSubnet(pattern).contains(clientIP);
      } else {
        return ipPatternToRegex(pattern).test(clientIP);
      }
    });
  }
  return status;
};

export const isWhitelistedIP4 = async (
  clientIP: string,
  hostingInfo: HOSTING_INFO_TYPE
) => {
  if (
    hostingInfo.ipWhiteListingType === IP_WHITELISTING_TYPE.NO_IP_WHITELISTING
  ) {
    return true;
  }

  if (
    hostingInfo.ipWhiteListingType ===
    IP_WHITELISTING_TYPE.IPV4_ADDRESSES_WHITELIST
  ) {
    if (hostingInfo.ipv4Addresses.includes(clientIP)) {
      console.log("IP_WHITELISTING_TYPE.IPV4_ADDRESSES_WHITELIST");
      return true;
    } else {
      return checkWhiteList(clientIP, hostingInfo.ipv4Addresses);
    }
  }
};

const clientIP = "192.168.2.111";

isWhitelistedIP4(clientIP, hostingInfo).then((response) =>
  console.log(response)
);
