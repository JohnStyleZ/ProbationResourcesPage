function ipToNumber(ip) {
  if (!ip || !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return null;

  return ip
    .split(".")
    .reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

function isIpAllowed(ip, allowedList) {
  const ipNum = ipToNumber(ip);
  if (ipNum === null) return false;

  return allowedList.some(entry => {
    entry = entry.trim();
    if (!entry) return false;

    // Exact IP match
    if (!entry.includes("/")) {
      return ip === entry;
    }

    // CIDR range match, example: 73.45.120.0/24
    const [range, bits] = entry.split("/");
    const rangeNum = ipToNumber(range);
    const bitNum = Number(bits);

    if (rangeNum === null || Number.isNaN(bitNum)) return false;

    const mask = ~(2 ** (32 - bitNum) - 1) >>> 0;
    return (ipNum & mask) === (rangeNum & mask);
  });
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  const allowedIps = (process.env.ADMIN_ALLOWED_IPS || "")
    .split(",")
    .map(ip => ip.trim())
    .filter(Boolean);

  if (allowedIps.length > 0) {
    const clientIp = getClientIp(req);

    if (!isIpAllowed(clientIp, allowedIps)) {
      return res.status(403).json({
        success: false,
        error: "Access denied"
      });
    }
  }

  const { password } = req.body || {};

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({
      success: false,
      error: "ADMIN_PASSWORD is not configured"
    });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true
    });
  }

  return res.status(401).json({
    success: false,
    error: "Invalid admin access code"
  });
}
