export default async function handler(req, res) {
  try {
    const owner = process.env.GITHUB_OWNER || 'JohnStyleZ';
    const repo = process.env.GITHUB_REPO || 'ProbationResourcesPage';
    const branch = process.env.GITHUB_BRANCH || 'main';
    const path = process.env.GITHUB_JSON_PATH || 'resources.json';
    const token = process.env.GITHUB_TOKEN;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

    const githubRes = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'probation-resources-site',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    const data = await githubRes.json();

    if (!githubRes.ok) {
      return res.status(githubRes.status).json({
        success: false,
        error: 'Could not load resources.json from GitHub',
        github: data
      });
    }

    const content = Buffer.from(data.content || '', 'base64').toString('utf8');
    const json = JSON.parse(content);

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    return res.status(200).json(json);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
