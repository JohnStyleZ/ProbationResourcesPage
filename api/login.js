export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const { password } = req.body || {};

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({
      success: false,
      error: 'ADMIN_PASSWORD is not configured'
    });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid admin access code'
  });
}
