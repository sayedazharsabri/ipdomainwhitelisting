function isFullIPAddress(ipPattern: string) {
  const ipRegex = /^\d+\.\d+\.\d+\.\d+$/;
  return ipRegex.test(ipPattern);
}

function isCIDRFormat(ipPattern: string) {
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  return cidrRegex.test(ipPattern);
}

function isAllowedFormat(ipPattern: string) {
  const ipAllowedPatternRegex =
    /^(?:\d{1,3}\.){0,3}(?:\d{1,3}|\*)(?:\.\d{1,3}|\.\*|\*)?$/;

  return ipAllowedPatternRegex.test(ipPattern);
}

const checkWhiteList = (whitelistPatternsListToCheck: string[]) => {
  const finalList = whitelistPatternsListToCheck.map((ipPattern) => {
    console.log(ipPattern);
    if (isFullIPAddress(ipPattern)) {
      return ipPattern;
    } else if (isCIDRFormat(ipPattern)) {
      return ipPattern;
    } else if (isAllowedFormat(ipPattern)) {
      return ipPattern;
    } else {
      throw new Error("Format not allowed");
    }
  });
};

const whitelistPatternsList = ["192.*", "198.198.1.123", "10.10.1.1/24"];
checkWhiteList(whitelistPatternsList);
