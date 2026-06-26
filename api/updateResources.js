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

    if (!entry.includes("/")) {
      return ip === entry;
    }

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

function checkIpAllowlist(req) {
  const allowedIps = (process.env.ADMIN_ALLOWED_IPS || "")
    .split(",")
    .map(ip => ip.trim())
    .filter(Boolean);

  if (allowedIps.length === 0) {
    return true;
  }

  const clientIp = getClientIp(req);
  return isIpAllowed(clientIp, allowedIps);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  if (!checkIpAllowlist(req)) {
    return res.status(403).json({
      success: false,
      error: "Access denied"
    });
  }

  try {
    const { password, resources, payload } = req.body || {};

    if (!process.env.ADMIN_PASSWORD) {
      return res.status(500).json({
        success: false,
        error: "ADMIN_PASSWORD is not configured"
      });
    }

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        error: "Invalid admin access code"
      });
    }

    const finalPayload = payload && Array.isArray(payload.resources)
      ? payload
      : { settings: {}, resources };

    if (!Array.isArray(finalPayload.resources)) {
      return res.status(400).json({
        success: false,
        error: "resources must be an array"
      });
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";
    const token = process.env.GITHUB_TOKEN;
    const path = process.env.GITHUB_JSON_PATH || "resources.json";

    if (!owner || !repo || !token) {
      return res.status(500).json({
        success: false,
        error: "GitHub environment variables are missing"
      });
    }

    const currentFile = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "probation-resources-admin"
        }
      }
    );

    const currentData = await currentFile.json();

    if (!currentFile.ok) {
      return res.status(currentFile.status).json({
        success: false,
        error: "Could not read resources.json from GitHub",
        github: currentData
      });
    }

    const updatedContent = Buffer
      .from(JSON.stringify(finalPayload, null, 2))
      .toString("base64");

    const githubResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "probation-resources-admin"
        },
        body: JSON.stringify({
          message: "Update resources.json from admin panel",
          content: updatedContent,
          sha: currentData.sha,
          branch
        })
      }
    );

    const githubResult = await githubResponse.json();

    if (!githubResponse.ok) {
      return res.status(githubResponse.status).json({
        success: false,
        error: "Could not update resources.json on GitHub",
        github: githubResult
      });
    }

    return res.status(200).json({
      success: true,
      githubResult
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
