export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success:false, error:'Method not allowed' });
  }

  try {
    const { password, resources } = req.body || {};

    if (!process.env.ADMIN_PASSWORD) {
      return res.status(500).json({ success:false, error:'ADMIN_PASSWORD is not configured' });
    }

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ success:false, error:'Invalid admin access code' });
    }

    if (!Array.isArray(resources)) {
      return res.status(400).json({ success:false, error:'resources must be an array' });
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;
    const path = process.env.GITHUB_JSON_PATH || 'resources.json';

    if (!owner || !repo || !token) {
      return res.status(500).json({ success:false, error:'GitHub environment variables are missing' });
    }

    const currentFile = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'probation-resources-admin'
        }
      }
    );

    const currentData = await currentFile.json();

    if (!currentFile.ok) {
      return res.status(currentFile.status).json({
        success:false,
        error:'Could not read resources.json from GitHub',
        github: currentData
      });
    }

    const updatedContent = Buffer.from(JSON.stringify(resources, null, 2)).toString('base64');

    const githubResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'probation-resources-admin'
        },
        body: JSON.stringify({
          message: 'Update resources.json from admin panel',
          content: updatedContent,
          sha: currentData.sha,
          branch
        })
      }
    );

    const githubResult = await githubResponse.json();

    if (!githubResponse.ok) {
      return res.status(githubResponse.status).json({
        success:false,
        error:'Could not update resources.json on GitHub',
        github: githubResult
      });
    }

    return res.status(200).json({ success:true, githubResult });

  } catch (err) {
    return res.status(500).json({ success:false, error:err.message });
  }
}
